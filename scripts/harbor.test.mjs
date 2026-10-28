import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, symlink, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { generateHarbor } from './harbor.mjs';

const route = 'resources/ai-model/harbor-examples';
const basicTask = {
  'README.md': '# 中文任务\n\n这是一个 **示例**。\n\nREADME_BODY_NOT_IN_MDX',
  'README.en.md': '# English task\n\nAn **example** with a [specification](https://example.com/spec).\n\nREADME_BODY_NOT_IN_MDX',
  'task.toml': 'version = "1.0"\n',
  'instruction.md': '# Task instructions\n\nINSTRUCTION_BODY_NOT_IN_MDX',
};
async function writeFiles(root, files) {
  for (const [file, bytes] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), bytes);
  }
}
async function fixture(t, tasks = { example: basicTask }) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ai4chip-harbor-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [name, files] of Object.entries(tasks)) await writeFiles(path.join(root, 'env/examples', name), files);
  const outputDir = path.join(root, 'generated-docs');
  const publicDir = path.join(root, 'generated-public');
  const options = { root, outputDir, publicDir, repoUrl: 'https://github.com/example/repository' };
  return { ...options, generate: (locale = 'zh') => generateHarbor({ ...options, locale }),
    data: async () => JSON.parse(await readFile(path.join(outputDir, 'harbor-data.json'), 'utf8')) };
}
async function allFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    files.push(...entry.isDirectory() ? await allFiles(full) : [full]);
  }
  return files;
}

test('one localized page holds multiple tasks, shared downloads, and merged browser metadata', async t => {
  const manifest = { archive: { name: 'original.tgz', size: 10000, sha256: 'not-published-in-metadata' }, platform: 'linux/amd64',
    files: [{ path: 'external/tool.json', size: 9000, version: 'v1' }, { path: 'external/process.lib', size: 1000 }] };
  const files = { ...basicTask, 'prepare.py': 'print("prepare")\n', 'environment/Dockerfile': 'FROM example\n',
    'environment/files/input.v': 'module input_design(); endmodule\n', 'environment/files/spec name.json': '{}\n',
    'environment/files/requirements.lock': 'dependency==1\n', 'environment/files/LICENSE': 'License\n',
    'tests/grader.py': 'print("grade")\n', 'tests/test.sh': '#!/bin/sh\nexit 0\n',
    'solution/reference.v': 'module reference(); endmodule\n', 'assets.json': JSON.stringify(manifest),
    'external/tool.json': '{"largeDependency":true}', 'ignored.txt': 'Not an allowed source extension.' };
  const f = await fixture(t, { beta: basicTask, alpha: files });
  const zh = await f.generate();
  const en = await f.generate('en');
  assert.deepEqual(zh.map(record => [record.slug, record.taskId]), [[route, 'alpha'], [route, 'beta']]);
  assert.deepEqual(en.map(record => record.slug), [`en/${route}`, `en/${route}`]);
  assert.equal(zh[0].source, 'env/examples/alpha/README.md');
  assert.equal(en[0].source, 'env/examples/alpha/README.en.md');
  const data = await f.data();
  assert.equal(data.zh.length, 2);
  assert.equal(data.en.length, 2);
  assert.equal(data.en[0].description, 'An example with a specification.');
  assert.deepEqual(data.zh[0].files, data.en[0].files);
  assert.deepEqual(data.zh[0].archive, { name: 'original.tgz', size: 10000 });
  assert.deepEqual(data.zh[0].dependencies, [
    { path: 'external/tool.json', size: 9000, version: 'v1' },
    { path: 'external/process.lib', size: 1000, version: null },
  ]);
  assert.equal(data.zh[0].platform, 'linux/amd64');
  assert.deepEqual(data.zh[1].archive, { name: null, size: null });
  assert.equal(data.zh[1].platform, null);
  assert.deepEqual(data.zh[1].dependencies, []);
  const paths = data.zh[0].files.map(file => file.path);
  for (const name of ['prepare.py', 'environment/Dockerfile', 'environment/files/input.v', 'environment/files/requirements.lock',
    'environment/files/LICENSE', 'tests/grader.py', 'tests/test.sh', 'solution/reference.v']) assert.ok(paths.includes(name), name);
  assert.ok(!paths.includes('external/tool.json'));
  assert.ok(!paths.includes('ignored.txt'));
  const spec = data.zh[0].files.find(file => file.path === 'environment/files/spec name.json');
  assert.equal(spec.url, '/environments/alpha/environment/files/spec%20name.json');
  assert.equal(data.zh[0].files.find(file => file.path === 'environment/Dockerfile').url, '/environments/alpha/environment/Dockerfile.txt');
  assert.equal(data.zh[0].files.find(file => file.path === 'environment/files/LICENSE').url, '/environments/alpha/environment/files/LICENSE.txt');
  assert.equal(data.zh[0].files.find(file => file.path === 'prepare.py').url, '/environments/alpha/prepare.py');
  for (const file of data.zh[0].files) {
    const bytes = await readFile(path.join(f.publicDir, decodeURIComponent(file.url)));
    assert.equal(bytes.length, file.size);
    assert.equal(bytes.toString(), files[file.path]);
  }
  const pages = (await allFiles(f.outputDir)).filter(file => file.endsWith('.mdx')).map(file => path.relative(f.outputDir, file)).sort();
  assert.deepEqual(pages, [`en/${route}.mdx`, `${route}.mdx`]);
  for (const [prefix, title] of [['', 'Harbor 环境示例'], ['en/', 'Harbor Environment Examples']]) {
    const page = await readFile(path.join(f.outputDir, `${prefix}${route}.mdx`), 'utf8');
    assert.ok(page.includes(`title: "${title}"`));
    assert.ok(!page.includes('BODY_NOT_IN_MDX'));
    assert.ok(!page.includes('```'));
  }
});

test('publication excludes symlinks, secrets, binary files, large files, generated copies, and external assets', async t => {
  const f = await fixture(t, { example: { ...basicTask,
    'safe.py': 'print("safe")\n', 'nul.py': Buffer.from([0, 65]), 'invalid.json': Buffer.from([0xff, 0xfe]),
    'control.v': Buffer.from([1, 65]), 'oversized.md': 'a'.repeat(512 * 1024 + 1),
    'credentials.json': '{"value":"sensitive"}', 'private-key.toml': 'value="sensitive"',
    'key-in-code.py': '-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----',
    'api-example.py': `value = "${'ghp_' + 'a'.repeat(36)}"`,
    '.hidden.md': 'hidden', 'logs/report.md': 'log', 'evidence/trace.json': '{}',
    'tests/public/generated.py': 'generated', 'output/result.v': 'generated', 'node_modules/library/index.json': '{}',
    'external-runtime/readme.md': 'Dependency content', 'external.json': '{}',
    'assets.json': JSON.stringify({ files: [{ path: 'external-runtime' }, { path: 'external.json' }] }),
  } });
  const taskDir = path.join(f.root, 'env/examples/example');
  await writeFiles(f.root, { 'outside/secret.py': 'outside task boundary' });
  await symlink(path.join(f.root, 'outside/secret.py'), path.join(taskDir, 'linked.py'));
  await symlink(path.join(f.root, 'outside'), path.join(taskDir, 'linked-directory'));
  await symlink(taskDir, path.join(f.root, 'env/examples/linked-task'));
  const summary = await f.generate();
  assert.equal(summary.length, 1);
  const data = await f.data();
  assert.deepEqual(data.zh[0].files.map(file => file.path).sort(), [...Object.keys(basicTask), 'assets.json', 'safe.py'].sort());
  const published = await allFiles(f.publicDir);
  assert.equal(published.length, data.zh[0].files.length);
});

test('a later generation removes formerly public files that no longer pass the checks', async t => {
  const f = await fixture(t, { example: { ...basicTask, 'module.py': 'print("safe")' } });
  await f.generate();
  const published = path.join(f.publicDir, 'environments/example/module.py');
  assert.ok((await stat(published)).isFile());
  await writeFile(path.join(f.root, 'env/examples/example/module.py'), '-----BEGIN PRIVATE KEY-----');
  await f.generate();
  await assert.rejects(stat(published), { code: 'ENOENT' });
  assert.ok(!(await f.data()).zh[0].files.some(file => file.path === 'module.py'));
});

test('symlinked task roots and metadata files are not followed', async t => {
  const f = await fixture(t, {});
  await writeFiles(path.join(f.root, 'outside/example'), basicTask);
  await mkdir(path.join(f.root, 'env'), { recursive: true });
  await symlink(path.join(f.root, 'outside'), path.join(f.root, 'env/examples'));
  assert.deepEqual(await f.generate(), []);
  assert.deepEqual((await f.data()).zh, []);
  const g = await fixture(t);
  await rm(path.join(g.root, 'env/examples/example/README.md'));
  await writeFiles(g.root, { 'outside.md': '# Outside' });
  await symlink(path.join(g.root, 'outside.md'), path.join(g.root, 'env/examples/example/README.md'));
  await assert.rejects(g.generate(), /Missing regular task file/);
});

test('invalid manifests, missing translations, colliding task IDs, and source-directory output are rejected', async t => {
  const invalid = await fixture(t, { example: { ...basicTask, 'assets.json': '{"files":[{"path":"../outside.py"}]}' } });
  await assert.rejects(invalid.generate(), /safe relative paths/);
  const missing = await fixture(t);
  await rm(path.join(missing.root, 'env/examples/example/README.en.md'));
  await assert.rejects(missing.generate('en'), /Missing regular task file/);
  const collision = await fixture(t, { 'same name': basicTask, 'same-name': basicTask });
  await assert.rejects(collision.generate(), /Duplicate or invalid environment slug/);
  await assert.rejects(generateHarbor({ root: missing.root, outputDir: 'env/examples/generated',
    publicDir: missing.publicDir, repoUrl: missing.repoUrl }), /separate from source task directories/);
});

test('empty task collections still generate the page and merge both locales', async t => {
  const f = await fixture(t, {});
  assert.deepEqual(await f.generate('en'), []);
  assert.deepEqual(await f.generate('zh'), []);
  assert.deepEqual(await f.data(), { zh: [], en: [] });
  assert.ok((await stat(path.join(f.outputDir, `${route}.mdx`))).isFile());
  assert.ok((await stat(path.join(f.outputDir, `en/${route}.mdx`))).isFile());
});

test('extensionless download aliases cannot overwrite another maintained file', async t => {
  const f = await fixture(t, { example: { ...basicTask, 'LICENSE': 'Original license', 'LICENSE.txt': 'Another license' } });
  await assert.rejects(f.generate(), /Public file URL collision/);
});
