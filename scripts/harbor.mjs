import { mkdir, readdir, readFile, lstat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_DOCUMENT_BYTES = 512 * 1024;
const MAX_PUBLIC_BYTES = 512 * 1024;
const PUBLIC_FILES = new Set([
  'README.md', 'README.en.md', 'instruction.md', 'task.toml', 'assets.json',
  'environment/Dockerfile', 'tests/Dockerfile',
  'environment/files/README.md', 'environment/files/cases.json',
  'environment/files/runtime.json',
]);
const HIDDEN_DIRECTORIES = new Set([
  'node_modules', '__pycache__', 'cache', 'caches', 'logs', 'jobs',
  'evidence', 'rollouts', 'tmp', 'venv',
]);
const LABELS = {
  zh: {
    indexTitle: '环境与任务',
    indexDescription: '可运行的 AI for Chip Harbor 任务、规格与环境示例。',
    indexIntroduction: '这些示例将任务说明、容器环境、参考解和验证器放在同一目录，便于开展 agent 实验与评测。',
    allEnvironments: '所有环境', taskSource: '任务源文件', overview: '概览',
    instruction: '任务说明', configuration: '配置', viewTask: '查看任务目录',
    viewConfig: '查看 task.toml', files: '目录与依赖', downloads: '小文件下载',
    source: '源码', archive: '来源归档', platform: '运行平台',
    dependency: '依赖', size: '大小', version: '版本', checksums: '完整依赖与校验值',
    fallbackDescription: (title) => `${title} 的 Harbor 任务说明、运行配置和依赖。`,
    dependencyIntroduction: (assets, prepare) => `外部工具和工艺依赖记录在 [assets.json](${assets})，通过 [prepare.py](${prepare}) 从本地原始归档恢复并校验。`,
  },
  en: {
    indexTitle: 'Environments and tasks',
    indexDescription: 'Runnable AI for Chip Harbor tasks, specifications, and environment examples.',
    indexIntroduction: 'These examples keep task instructions, container environments, reference solutions, and verifiers together for agent experiments and evaluation.',
    allEnvironments: 'All environments', taskSource: 'Task source', overview: 'Overview',
    instruction: 'Task instructions', configuration: 'Configuration', viewTask: 'View task directory',
    viewConfig: 'View task.toml', files: 'Files and dependencies', downloads: 'Small-file downloads',
    source: 'Source', archive: 'Source archive', platform: 'Runtime platform',
    dependency: 'Dependency', size: 'Size', version: 'Version', checksums: 'Full dependency manifest and checksums',
    fallbackDescription: (title) => `Harbor task instructions, runtime configuration, and dependencies for ${title}.`,
    dependencyIntroduction: (assets, prepare) => `External tools and process libraries are recorded in [assets.json](${assets}). Use [prepare.py](${prepare}) to restore and verify them from the original local archive.`,
  },
};

const encodePath = (value) => value.split('/').map(encodeURIComponent).join('/');
const plain = (value) => String(value).replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[*_`]/g, '').trim();
const escapeText = (value) => String(value).replace(/&/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
const tableText = (value) => escapeText(value ?? '—').replace(/\|/g, '&#124;').replace(/\r?\n/g, ' ');

function fence(text, language = 'text') {
  const longest = Math.max(2, ...Array.from(text.matchAll(/`+/g), (m) => m[0].length));
  const marker = '`'.repeat(longest + 1);
  return `${marker}${language}\n${text.trimEnd()}\n${marker}`;
}

function frontmatter(title, description) {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n`;
}

function fileSize(bytes) {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
}

async function regularFile(base, relative) {
  const parts = relative.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..')) return null;
  let current = base;
  for (let i = 0; i < parts.length; i += 1) {
    current = path.join(current, parts[i]);
    let info;
    try { info = await lstat(current); } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
    if (info.isSymbolicLink()) return null;
    if (i < parts.length - 1 && !info.isDirectory()) return null;
    if (i === parts.length - 1) return info.isFile() ? info : null;
  }
  return null;
}

async function readDocument(base, relative, required = false) {
  const info = await regularFile(base, relative);
  if (!info) {
    if (required) throw new Error(`Missing regular task file: ${path.join(base, relative)}`);
    return '';
  }
  if (info.size > MAX_DOCUMENT_BYTES) throw new Error(`Task document exceeds 512 KiB: ${relative}`);
  return readFile(path.join(base, relative), 'utf8');
}

function metadata(markdown, fallback, labels) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
  const title = plain(body.match(/^#\s+(.+)$/m)?.[1] || fallback);
  const introduction = body.replace(/^#\s+.+\r?\n+/, '').split(/\r?\n\s*\r?\n/)[0] || '';
  const description = Array.from(plain(introduction).replace(/\s+/g, ' ')).slice(0, 180).join('')
    || labels.fallbackDescription(title);
  return { title, description };
}

function sourceUrl(repoUrl, branch, relative) {
  return `${repoUrl}/blob/${encodeURIComponent(branch)}/${encodePath(relative)}`;
}

function rewriteMarkdown(markdown, { taskRelative, sourceFile, downloadUrls, repoUrl, branch }) {
  let body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/^#\s+.+\r?\n+/, '');
  let activeFence = null;
  const lines = body.split('\n').map((line) => {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!activeFence) activeFence = marker[1];
      else if (marker[1][0] === activeFence[0] && marker[1].length >= activeFence.length && !marker[2].trim()) activeFence = null;
      return line;
    }
    if (activeFence) return line;
    // Content files are Markdown, not executable MDX. Keep code spans intact.
    let cooked = line.split(/(`+[^`]*`+)/g).map((part) => part.startsWith('`') ? part : escapeText(part)).join('');
    cooked = cooked.replace(/^(import|export)(?=\s)/, (word) => `&#${word.charCodeAt(0)};${word.slice(1)}`);
    cooked = cooked.replace(/^(#{1,5})\s/, '$1# ');
    cooked = cooked.replace(/(!?)\[([^\]]*)\]\(([^)]+)\)/g, (match, image, label, destination) => {
      const target = destination.match(/^(\S+)(?:\s+(["']).*\2)?$/)?.[1];
      if (!target || target.startsWith('#') || target.startsWith('/')) return match;
      if (/^https?:\/\//i.test(target) || /^mailto:/i.test(target)) return match;
      if (/^[a-z][a-z\d+.-]*:/i.test(target)) return label;
      const [pathname, suffix = ''] = target.split(/(?=[?#])/s, 2);
      const local = path.posix.normalize(path.posix.join(path.posix.dirname(sourceFile), pathname));
      const projectPath = path.posix.normalize(path.posix.join(taskRelative, local));
      if (projectPath.startsWith('../')) return label;
      const url = downloadUrls.get(local) || sourceUrl(repoUrl, branch, projectPath);
      // Non-published images remain links to their source file.
      return `[${label}](${url}${suffix})`;
    });
    return cooked;
  });
  if (activeFence) lines.push(activeFence);
  return lines.join('\n').trim();
}

async function taskTree(taskDir, excludedAssets) {
  const lines = [];
  async function visit(relative, depth, prefix) {
    const entries = (await readdir(path.join(taskDir, relative), { withFileTypes: true }))
      .filter((entry) => !entry.name.startsWith('.') && !entry.isSymbolicLink())
      .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name, 'en'));
    const visible = [];
    for (const entry of entries) {
      const child = relative ? `${relative}/${entry.name}` : entry.name;
      if (HIDDEN_DIRECTORIES.has(entry.name) || child === 'tests/public' || excludedAssets.has(child)) continue;
      if (/\.(?:tgz|tar|gz|zip|7z|lib|lef|tlef|pem|key|pyc)$/i.test(entry.name) || /^id_(?:rsa|ed25519)/.test(entry.name)) continue;
      if (entry.isFile()) {
        const info = await lstat(path.join(taskDir, child));
        if (info.size > MAX_DOCUMENT_BYTES) continue;
      }
      if (entry.isFile() || entry.isDirectory()) visible.push({ entry, child });
    }
    for (let i = 0; i < visible.length; i += 1) {
      const { entry, child } = visible[i];
      const last = i === visible.length - 1;
      lines.push(`${prefix}${last ? '└──' : '├──'} ${entry.name}${entry.isDirectory() ? '/' : ''}`);
      if (entry.isDirectory() && depth < 3) await visit(child, depth + 1, prefix + (last ? '    ' : '│   '));
    }
  }
  await visit('', 1, '');
  return lines.join('\n');
}

async function publishSmallFiles(taskDir, slug, publicDir) {
  const candidates = new Set(PUBLIC_FILES);
  const filesDir = path.join(taskDir, 'environment/files');
  try {
    const parent = await lstat(filesDir);
    if (parent.isDirectory() && !parent.isSymbolicLink()) {
      for (const entry of await readdir(filesDir, { withFileTypes: true })) {
        if (entry.isFile() && /^spec(?:_[a-zA-Z0-9-]+)?\.json$/.test(entry.name)) candidates.add(`environment/files/${entry.name}`);
      }
    }
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const urls = new Map();
  for (const relative of [...candidates].sort()) {
    const info = await regularFile(taskDir, relative);
    if (!info || info.size > MAX_PUBLIC_BYTES) continue;
    const bytes = await readFile(path.join(taskDir, relative));
    if (bytes.includes(0) || /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/.test(bytes.toString('utf8'))) continue;
    const destination = path.join(publicDir, 'environments', slug, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, bytes);
    urls.set(relative, `/environments/${encodeURIComponent(slug)}/${encodePath(relative)}`);
  }
  return urls;
}

function dependencies(manifest, source, downloads, labels) {
  const files = Array.isArray(manifest.files) ? manifest.files : [];
  if (!files.length) return '';
  const lines = [
    labels.dependencyIntroduction(downloads.get('assets.json') || source('assets.json'), source('prepare.py')),
  ];
  if (manifest.archive?.name) lines.push(`${labels.archive}: ${tableText(manifest.archive.name)} (${fileSize(manifest.archive.size)})`);
  if (manifest.platform) lines.push(`${labels.platform}: ${tableText(manifest.platform)}`);
  const rows = [`| ${labels.dependency} | ${labels.size} | ${labels.version} |`, '| --- | ---: | --- |'];
  for (const file of files) rows.push(`| ${tableText(file.path)} | ${fileSize(file.size)} | ${tableText(file.version)} |`);
  lines.push(rows.join('\n'));
  lines.push(`<details>\n<summary>${labels.checksums}</summary>\n\n${fence(JSON.stringify(manifest, null, 2), 'json')}\n\n</details>`);
  return lines.join('\n\n');
}

/** Generate static Harbor pages and small-file downloads using only local task sources.
 * Returns [{ slug: '[en/]environments/<task-id>', title, description, source }].
 * English pages use maintained README.en.md translations. Download URLs are shared.
 * Output directories are owned/cleaned by the caller; source tasks are never changed.
 */
export async function generateHarbor({ root, outputDir, publicDir, repoUrl, branch = 'main', locale = 'zh' }) {
  if (![root, outputDir, publicDir, repoUrl, branch].every((value) => typeof value === 'string' && value.trim())) {
    throw new TypeError('generateHarbor requires root, outputDir, publicDir, repoUrl, and a non-empty branch');
  }
  if (!Object.hasOwn(LABELS, locale)) throw new RangeError(`Unsupported Harbor locale: ${locale}`);
  const labels = LABELS[locale];
  const routePrefix = locale === 'en' ? 'en/environments' : 'environments';
  const readmeFile = locale === 'en' ? 'README.en.md' : 'README.md';
  repoUrl = repoUrl.replace(/\/$/, '').replace(/\.git$/, '');
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
  try { entries = await readdir(taskRoot, { withFileTypes: true }); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    entries = [];
  }
  const summary = [];
  const slugs = new Set();
  const docsDir = path.join(outputDir, ...routePrefix.split('/'));
  await mkdir(docsDir, { recursive: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
    const taskDir = path.join(taskRoot, entry.name);
    if (!await regularFile(taskDir, 'task.toml')) continue;
    const slug = entry.name === 'index' ? 'task-index' : entry.name.normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '-');
    if (!slug || slugs.has(slug)) throw new Error(`Duplicate or invalid environment slug: ${entry.name}`);
    slugs.add(slug);
    const [readme, instruction, config, assets] = await Promise.all([
      readDocument(taskDir, readmeFile, locale === 'en'), readDocument(taskDir, 'instruction.md'),
      readDocument(taskDir, 'task.toml', true), readDocument(taskDir, 'assets.json'),
    ]);
    let manifest = {};
    if (assets) {
      try { manifest = JSON.parse(assets); } catch (error) { throw new Error(`Invalid assets.json in ${entry.name}: ${error.message}`); }
      if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error(`Expected an assets object in ${entry.name}`);
      if (manifest.files !== undefined && (!Array.isArray(manifest.files) || manifest.files.some((file) => !file || typeof file.path !== 'string'))) {
        throw new Error(`Expected an assets.files array of file records in ${entry.name}`);
      }
    }
    const { title, description } = metadata(readme || instruction, entry.name, labels);
    const primaryFile = readme ? readmeFile : instruction ? 'instruction.md' : 'task.toml';
    const taskRelative = `env/examples/${entry.name}`;
    const source = (relative) => sourceUrl(repoUrl, branch, `${taskRelative}/${relative}`);
    const downloads = await publishSmallFiles(taskDir, slug, publicDir);
    const markdownOptions = { taskRelative, downloadUrls: downloads, repoUrl, branch };
    const tree = await taskTree(taskDir, new Set((manifest.files || []).map((file) => file.path)));
    const page = [
      frontmatter(title, description),
      `[${labels.allEnvironments}](/${routePrefix}/) · [${labels.taskSource}](${source(primaryFile)})`,
      `## ${labels.overview}`,
      readme ? rewriteMarkdown(readme, { ...markdownOptions, sourceFile: readmeFile }) : escapeText(description),
      `## ${labels.instruction}`,
      instruction ? rewriteMarkdown(instruction, { ...markdownOptions, sourceFile: 'instruction.md' }) : `[${labels.viewTask}](${source('task.toml')})`,
      `## ${labels.configuration}`,
      `[${labels.viewConfig}](${source('task.toml')})`,
      fence(config, 'toml'),
      `## ${labels.files}`,
      fence(`${entry.name}/\n${tree}`),
      dependencies(manifest, source, downloads, labels),
      `### ${labels.downloads}`,
      ...[...downloads].map(([relative, url]) => `- [${relative}](${url}) · [${labels.source}](${source(relative)})`),
    ].filter(Boolean).join('\n\n');
    await writeFile(path.join(docsDir, `${slug}.mdx`), page + '\n');
    summary.push({ slug: `${routePrefix}/${slug}`, title, description, source: `${taskRelative}/${primaryFile}` });
  }
  const index = [
    frontmatter(labels.indexTitle, labels.indexDescription),
    labels.indexIntroduction,
    ...summary.map((task) => `- [${escapeText(task.title)}](/${encodePath(task.slug)}/) — ${escapeText(task.description)}`),
  ].join('\n\n');
  await writeFile(path.join(docsDir, 'index.mdx'), index + '\n');
  return summary;
}
