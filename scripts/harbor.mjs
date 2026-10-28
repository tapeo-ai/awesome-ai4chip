import { mkdir, readdir, readFile, lstat, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const MAX_DOCUMENT_BYTES = 512 * 1024;
const MAX_PUBLIC_BYTES = 512 * 1024;
const PUBLIC_EXTENSIONS = new Set(['.py', '.v', '.sh', '.json', '.md', '.toml', '.lock']);
const HIDDEN_DIRECTORIES = new Set([
  'node_modules', '__pycache__', 'cache', 'caches', 'logs', 'jobs',
  'evidence', 'rollouts', 'tmp', 'temp', 'venv', 'build', 'dist',
  'output', 'outputs', 'results', 'artifacts', 'runs',
]);
const SECRET_NAME = /(?:^|[._-])(?:secrets?|credentials?|passwords?|tokens?|private[._-]?key)(?:[._-]|$)|^id_(?:rsa|ed25519)/i;
const SECRET_TEXT = /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|sk-(?:proj|svcacct)-[A-Za-z0-9_-]{20,})\b/;
const PAGE = 'resources/ai-model/harbor-examples';
const LABELS = {
  zh: {
    title: 'Harbor 环境示例',
    description: '可执行的 Harbor 训练与评测样本。',
    introduction: '[Harbor](https://docs.harborframework.com/tasks/overview) 将任务说明、运行环境与验证器打包为可执行的训练与评测样本。此处直接浏览任务目录；完整运行方式见 README，大型工具和 PDK 由 `assets.json` 与 `prepare.py` 管理。',
    fallbackDescription: (title) => `${title} 的 Harbor 任务说明、运行配置和依赖。`,
  },
  en: {
    title: 'Harbor Environment Examples',
    description: 'Executable Harbor training and evaluation examples.',
    introduction: '[Harbor](https://docs.harborframework.com/tasks/overview) packages task instructions, runtime environments, and verifiers into executable training and evaluation examples. Browse the task directory here; see the README for full running instructions. Large tools and PDKs are managed by `assets.json` and `prepare.py`.',
    fallbackDescription: (title) => `Harbor task instructions, runtime configuration, and dependencies for ${title}.`,
  },
};

const encodePath = (value) => value.split('/').map(encodeURIComponent).join('/');
const plain = (value) => String(value).replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]*>/g, '').replace(/[*_`]/g, '').trim();
const frontmatter = (title, description) => `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n`;
const bytesValue = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
const stringValue = (value) => typeof value === 'string' && value.trim() ? value : null;
const safeRelative = (value) => typeof value === 'string' && !value.includes('\\')
  && !value.includes('\0') && !path.posix.isAbsolute(value)
  && value.split('/').every(part => part && part !== '.' && part !== '..');

function publicText(bytes) {
  if (bytes.some(byte => byte < 32 && ![9, 10, 13].includes(byte)) || bytes.includes(127)) return null;
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { return null; }
  return SECRET_TEXT.test(text) ? null : text;
}

async function regularPath(base, relative, directory = false) {
  if (!safeRelative(relative)) return null;
  const parts = relative.split('/');
  let current = base;
  for (let i = 0; i < parts.length; i += 1) {
    current = path.join(current, parts[i]);
    let info;
    try { info = await lstat(current); }
    catch (error) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null; throw error; }
    if (info.isSymbolicLink()) return null;
    if (i < parts.length - 1 && !info.isDirectory()) return null;
    if (i === parts.length - 1) return (directory ? info.isDirectory() : info.isFile()) ? info : null;
  }
  return null;
}

async function readDocument(base, relative, required = false) {
  const info = await regularPath(base, relative);
  if (!info) {
    if (required) throw new Error(`Missing regular task file: ${path.join(base, relative)}`);
    return '';
  }
  if (info.size > MAX_DOCUMENT_BYTES) throw new Error(`Task document exceeds 512 KiB: ${relative}`);
  const text = publicText(await readFile(path.join(base, relative)));
  if (text === null) throw new Error(`Task document must be public UTF-8 text: ${relative}`);
  return text;
}

function metadata(markdown, fallback, labels) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
  const title = plain(body.match(/^#\s+(.+)$/m)?.[1] || fallback);
  const introduction = body.replace(/^#\s+.+\r?\n+/, '').split(/\r?\n\s*\r?\n/)[0] || '';
  const description = Array.from(plain(introduction).replace(/\s+/g, ' ')).slice(0, 180).join('')
    || labels.fallbackDescription(title);
  return { title, description };
}

function parseManifest(assets, taskId) {
  if (!assets) return {};
  let manifest;
  try { manifest = JSON.parse(assets); }
  catch (error) { throw new Error(`Invalid assets.json in ${taskId}: ${error.message}`); }
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error(`Expected an assets object in ${taskId}`);
  if (manifest.files !== undefined && (!Array.isArray(manifest.files)
    || manifest.files.some(file => !file || !safeRelative(file.path)))) {
    throw new Error(`Expected an assets.files array with safe relative paths in ${taskId}`);
  }
  return manifest;
}

async function publishSmallFiles(taskDir, id, publicDir, excludedAssets) {
  const destinationRoot = path.join(publicDir, 'environments', id);
  // The caller owns generated output; remove stale files that are no longer publishable.
  await rm(destinationRoot, { recursive: true, force: true });
  const files = [];
  const publicPaths = new Set();
  async function visit(relative = '') {
    const entries = (await readdir(path.join(taskDir, relative), { withFileTypes: true }))
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.isSymbolicLink() || SECRET_NAME.test(entry.name)) continue;
      const child = relative ? `${relative}/${entry.name}` : entry.name;
      if (child === 'tests/public' || excludedAssets.some(asset => child === asset || child.startsWith(`${asset}/`))) continue;
      if (entry.isDirectory()) {
        if (!HIDDEN_DIRECTORIES.has(entry.name.toLowerCase())) await visit(child);
        continue;
      }
      if (!entry.isFile() || (!PUBLIC_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
        && entry.name !== 'Dockerfile' && !/^LICENSE(?:\.(?:md|txt))?$/i.test(entry.name))) continue;
      const info = await regularPath(taskDir, child);
      if (!info || info.size > MAX_PUBLIC_BYTES) continue;
      const bytes = await readFile(path.join(taskDir, child));
      if (bytes.length > MAX_PUBLIC_BYTES || publicText(bytes) === null) continue;
      const publicPath = path.extname(child) ? child : `${child}.txt`;
      if (publicPaths.has(publicPath)) throw new Error(`Public file URL collision in ${id}: ${publicPath}`);
      publicPaths.add(publicPath);
      const destination = path.join(destinationRoot, publicPath);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
      files.push({ path: child, size: bytes.length, url: `/environments/${encodeURIComponent(id)}/${encodePath(publicPath)}` });
    }
  }
  await visit();
  return files.sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

/** Generate one localized Harbor example page, file-browser metadata, and text downloads.
 * Returns one { slug, taskId, title, description, source } record per task; slug is shared.
 * README translations supply metadata; task content stays in fetched source files, not MDX.
 * Output directories are owned by the caller. Source task files are never changed.
 * Call locales sequentially: each invocation merges its records into harbor-data.json.
 */
export async function generateHarbor({ root, outputDir, publicDir, repoUrl, branch = 'main', locale = 'zh' }) {
  if (![root, outputDir, publicDir, repoUrl, branch].every(value => typeof value === 'string' && value.trim())) {
    throw new TypeError('generateHarbor requires root, outputDir, publicDir, repoUrl, and a non-empty branch');
  }
  if (!Object.hasOwn(LABELS, locale)) throw new RangeError(`Unsupported Harbor locale: ${locale}`);
  if (!/^https?:\/\//.test(repoUrl)) throw new TypeError('repoUrl must be an HTTP(S) repository URL');
  root = path.resolve(root);
  outputDir = path.resolve(root, outputDir);
  publicDir = path.resolve(root, publicDir);
  const taskRoot = path.join(root, 'env/examples');
  for (const destination of [outputDir, publicDir]) {
    if (destination === root || destination === taskRoot || destination.startsWith(taskRoot + path.sep)) {
      throw new Error('Generated output must be separate from source task directories');
    }
  }
  let entries;
  try { entries = await regularPath(root, 'env/examples', true) ? await readdir(taskRoot, { withFileTypes: true }) : []; }
  catch (error) { if (error.code !== 'ENOENT') throw error; entries = []; }
  const labels = LABELS[locale];
  const readmeFile = locale === 'en' ? 'README.en.md' : 'README.md';
  const slug = `${locale === 'en' ? 'en/' : ''}${PAGE}`;
  const summary = [];
  const records = [];
  const ids = new Set();
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
    const taskDir = path.join(taskRoot, entry.name);
    if (!await regularPath(taskDir, 'task.toml')) continue;
    const id = entry.name === 'index' ? 'task-index' : entry.name.normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '-');
    if (!id || ids.has(id)) throw new Error(`Duplicate or invalid environment slug: ${entry.name}`);
    ids.add(id);
    const [readme, , assets] = await Promise.all([
      readDocument(taskDir, readmeFile, true), readDocument(taskDir, 'task.toml', true), readDocument(taskDir, 'assets.json'),
    ]);
    const manifest = parseManifest(assets, entry.name);
    const { title, description } = metadata(readme, entry.name, labels);
    const source = `env/examples/${entry.name}/${readmeFile}`;
    const dependencies = (manifest.files || []).map(file => ({
      path: file.path, size: bytesValue(file.size), version: stringValue(file.version),
    }));
    const files = await publishSmallFiles(taskDir, id, publicDir, dependencies.map(file => file.path));
    records.push({ id, title, description, source, files, dependencies,
      archive: { name: stringValue(manifest.archive?.name), size: bytesValue(manifest.archive?.size) },
      platform: stringValue(manifest.platform),
    });
    summary.push({ slug, taskId: id, title, description, source });
  }
  const pageFile = path.join(outputDir, `${slug}.mdx`);
  await mkdir(path.dirname(pageFile), { recursive: true });
  await writeFile(pageFile, frontmatter(labels.title, labels.description) + labels.introduction + '\n');
  const dataFile = path.join(outputDir, 'harbor-data.json');
  let data = { zh: [], en: [] };
  try { data = JSON.parse(await readFile(dataFile, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!data || !Array.isArray(data.zh) || !Array.isArray(data.en)) throw new Error('Invalid existing harbor-data.json');
  data[locale] = records;
  await writeFile(dataFile, JSON.stringify(data, null, 2) + '\n');
  return summary;
}
