import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { checkContent, markdownLinks } from './check-content.mjs';
import { checkSite, htmlReferences, normalizeSiteBase } from './check-site.mjs';

async function fixture(t, files) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ai4chip-check-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [file, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), content);
  }
  return root;
}

const frontmatter = '---\ntitle: "Example"\ndescription: "Example description"\n---\n\n';
const nav = (pages) => JSON.stringify({ navigation: { groups: [{ group: 'Docs', pages }] } });

test('content counts catalog entries without counting Guide, EDA 101, or Latest references', async (t) => {
  const first = '- [Task A](https://example.com/problems) — A.';
  const root = await fixture(t, {
    'docs/docs.json': nav(['index', 'latest', 'resources/tasks', 'guide', 'resources/eda/eda-101', 'environments/index']),
    'docs/index.mdx': `${frontmatter}[Tasks](/resources/tasks)\n![Image](/assets/map.png)\n[Environment](/environments/index)`,
    'docs/latest.mdx': `${frontmatter}${first}`,
    'docs/resources/tasks.mdx': `${frontmatter}${first}\n- [Task B](https://example.com/problems) — B.`,
    'docs/guide.mdx': `${frontmatter}${first}\n- [EDA 101](/resources/eda/eda-101)\n- Read the introduction.`,
    'docs/resources/eda/eda-101.mdx': `${frontmatter}${first}\n- [Guide](/guide)\n- Open the timing report.`,
    'assets/map.png': 'image fixture',
    'README.md': '[Source](docs/resources/tasks.mdx)\n<img src="assets/map.png">',
  });
  const result = await checkContent({ root });
  assert.deepEqual(result.errors, []);
  assert.equal(result.resources, 2);
  assert.equal(Object.hasOwn(result, 'tutorials'), false);
  await writeFile(path.join(root, 'docs/resources/eda/eda-101.mdx'), `${frontmatter}- [Broken](/missing)`);
  assert.ok((await checkContent({ root })).errors.some(error => error.includes('eda-101.mdx') && error.includes('local link does not resolve')));
});

test('content rejects duplicate identity, missing navigation, frontmatter, and local targets', async (t) => {
  const root = await fixture(t, {
    'docs/docs.json': nav(['index', 'resources/tasks', 'missing']),
    'docs/index.mdx': '---\ntitle: \ndescription: "x"\n---\n[Broken](/nothing)',
    'docs/resources/tasks.mdx': `${frontmatter}- [A](https://example.com/a) — First.\n- [A](https://example.com/a) — Again.\n- [Broken](relative) — Invalid main URL.`,
    'docs/orphan.mdx': `${frontmatter}Orphan.`,
    'README.md': '[Missing source](docs/no.mdx)',
  });
  const result = await checkContent({ root });
  for (const message of ['missing page missing', 'not in navigation: orphan', 'frontmatter title', 'duplicate resource', 'named HTTP(S)', 'local link does not resolve']) {
    assert.ok(result.errors.some((error) => error.includes(message)), `${message}: ${JSON.stringify(result.errors)}`);
  }
});

test('Markdown link parsing ignores code and handles balanced parentheses and titles', () => {
  const parsed = markdownLinks('`[fake](missing)`\n```md\n[fake](missing)\n```\n[real](https://example.com/a(b))\n![map](<assets/a b.png> "Map")');
  assert.deepEqual(parsed.links.map((link) => link.url), ['https://example.com/a(b)', 'assets/a b.png']);
  assert.deepEqual(parsed.errors, []);
  assert.equal(markdownLinks('[broken](missing').errors.length, 1);
});

test('site resolves base paths, trailing slashes, Chinese anchors, downloads and Pagefind assets', async (t) => {
  const base = '/awesome-ai4chip/pr-preview/17/';
  const root = await fixture(t, {
    'index.html': `<a href="${base}guide/#%E4%B8%AD%E6%96%87">Guide</a><a href="${base.slice(0, -1)}">Home</a><a href="${base}plain.html#part">File</a><script src="${base}pagefind/pagefind-ui.js"></script><a href="mailto:mail@example.com">Email</a><a href="#">Empty</a>`,
    'guide/index.html': `<h2 id="中文">中文</h2><a href="../downloads/task%20config.toml?download=1&amp;mode=raw">Download</a><img src="../assets/map.svg"><a href="#中文">Here</a>`,
    'plain.html': '<a name="part">Part</a>',
    'downloads/task config.toml': '[task]',
    'assets/map.svg': '<svg/>',
    'pagefind/pagefind-ui.js': '/* fixture, never executed */',
  });
  const result = await checkSite({ distDir: root, base });
  assert.deepEqual(result.errors, []);
  assert.equal(result.htmlFiles, 3);
});

test('site catches wrong base, broken generated downloads, and missing anchors', async (t) => {
  const root = await fixture(t, {
    'index.html': '<img src="/assets/map.png"><a href="/awesome-ai4chip/guide/">Wrong preview base</a><a href="environments/downloads/missing.py">Missing</a><a href="#missing">Anchor</a>',
    'assets/map.png': 'fixture',
    'guide/index.html': '<h1>Guide</h1>',
  });
  const result = await checkSite({ distDir: root, base: '/awesome-ai4chip/pr-preview/17/' });
  assert.equal(result.errors.filter((error) => error.includes('outside SITE_BASE')).length, 2);
  assert.ok(result.errors.some((error) => error.includes('missing.py') && error.includes('does not exist')));
  assert.ok(result.errors.some((error) => error.includes('anchor #missing')));
});

test('site supports root deployment and does not inspect executable script text', async (t) => {
  const root = await fixture(t, {
    'index.html': '<script>const x = \'<img src="/missing">\';</script><style>/* <a href="/missing"> */</style><a href="/guide">Guide</a>',
    'guide/index.html': '<a href="/#:~:text=Hello">Text fragment</a>',
  });
  assert.deepEqual((await checkSite({ distDir: root, base: '/' })).errors, []);
  assert.deepEqual(htmlReferences('<img data-src="/lazy" src="/map.png">'), [{ attribute: 'src', url: '/map.png' }]);
  assert.equal(normalizeSiteBase('/awesome-ai4chip'), '/awesome-ai4chip/');
  assert.throws(() => normalizeSiteBase('awesome-ai4chip'));
  assert.throws(() => normalizeSiteBase('/a/../b/'));
});

test('bilingual content requires paired pages and matching external source links without double counting', async (t) => {
  const root = await fixture(t, {
    'docs/docs.json': JSON.stringify({ navigation: { languages: [
      { language: 'cn', groups: [{ group: '目录', pages: ['resources/example'] }] },
      { language: 'en', groups: [{ group: 'Directory', pages: ['en/resources/example'] }] },
    ] } }),
    'docs/resources/example.mdx': `${frontmatter}- [Example](https://example.com/a) — 中文说明。`,
    'docs/en/resources/example.mdx': `${frontmatter}- [Example](https://example.com/a) — English description.`,
    'README.md': '# Example',
  });
  const valid = await checkContent({ root });
  assert.deepEqual(valid.errors, []);
  assert.equal(valid.resources, 1);
  await writeFile(path.join(root, 'docs/en/resources/example.mdx'), `${frontmatter}- [Example](https://example.com/wrong) — Description.`);
  assert.ok((await checkContent({ root })).errors.some(e => e.includes('translation links differ')));
  await rm(path.join(root, 'docs/en/resources/example.mdx'));
  assert.ok((await checkContent({ root })).errors.some(e => e.includes('translation missing')));
});
