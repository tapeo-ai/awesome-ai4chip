import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isResourceCatalog } from './site.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const external = (value) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
const slash = (value) => value.split(path.sep).join('/');

async function filesUnder(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, item.name);
    if (item.isDirectory()) files.push(...await filesUnder(full));
    else if (item.isFile()) files.push(full);
  }
  return files.sort();
}

async function isFile(file) {
  try { return (await stat(file)).isFile(); }
  catch (error) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false; throw error; }
}

// Mask examples, preserving newlines for useful diagnostics.
function withoutCode(markdown) {
  let fence;
  return markdown.split('\n').map((line) => {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (marker?.[0] === fence[0] && marker.length >= fence.length) fence = undefined;
      return '';
    }
    if (marker) { fence = marker; return ''; }
    return line.replace(/(`+)([\s\S]*?)\1/g, (match) => ' '.repeat(match.length));
  }).join('\n').replace(/<!--[\s\S]*?-->/g, (match) => match.replace(/[^\n]/g, ' '));
}

export function markdownLinks(markdown) {
  const text = withoutCode(markdown);
  const links = [];
  const errors = [];
  const pattern = /!?\[[^\]\n]*\]\(/g;
  let match;
  while ((match = pattern.exec(text))) {
    const start = pattern.lastIndex;
    let depth = 1;
    let end = start;
    for (; end < text.length && depth; end += 1) {
      if (text[end] === '\\') { end += 1; continue; }
      if (text[end] === '(') depth += 1;
      if (text[end] === ')') depth -= 1;
    }
    const line = text.slice(0, match.index).split('\n').length;
    if (depth) { errors.push(`line ${line}: unclosed Markdown link`); break; }
    const destination = text.slice(start, end - 1).trim();
    const url = destination.startsWith('<')
      ? /^<([^>]+)>/.exec(destination)?.[1]
      : /^(\S+)/.exec(destination)?.[1];
    if (!url) errors.push(`line ${line}: empty Markdown link`);
    else links.push({ url: url.replace(/\\([()])/g, '$1'), line });
    pattern.lastIndex = end;
  }
  return { links, errors };
}

function frontmatterErrors(text) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)?.[1];
  if (block === undefined) return ['missing YAML frontmatter'];
  const errors = [];
  for (const key of ['title', 'description']) {
    const match = new RegExp(`^${key}:[ \\t]*([^\\n]*)(?:\\n((?:[ \\t]+[^\\n]*(?:\\n|$))*))?`, 'm').exec(block);
    let value = match?.[1]?.trim();
    if (value && /^[|>][-+]?\s*$/.test(value)) value = match[2]?.trim();
    if (value?.startsWith('"') && value.endsWith('"')) {
      try { value = JSON.parse(value); } catch { errors.push(`invalid quoted ${key}`); continue; }
    } else if (value?.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/''/g, "'");
    } else value = value?.replace(/\s+#.*$/, '').trim();
    if (!value?.trim() || /^(null|~)$/i.test(value)) errors.push(`missing non-empty frontmatter ${key}`);
  }
  return errors;
}

function navigationPages(value, result = []) {
  if (!value || typeof value !== 'object') return result;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'pages' && Array.isArray(child)) {
      for (const page of child) {
        if (typeof page === 'string') result.push(page);
        else navigationPages(page, result);
      }
    } else if (typeof child === 'object') navigationPages(child, result);
  }
  return result;
}

function pageSlug(file, docsRoot) {
  return slash(path.relative(docsRoot, file)).replace(/\.mdx$/, '');
}

function normalizeSlug(value) {
  return value.replace(/^\/+|\/+$/g, '').replace(/\.mdx$/, '') || 'index';
}

async function resolveMarkdownLink(url, file, root, docsRoot) {
  if (!url || external(url) || url.startsWith('#')) return null;
  let pathname;
  try { pathname = decodeURIComponent(url.split(/[?#]/, 1)[0]); }
  catch { return `invalid URL encoding: ${url}`; }
  if (!pathname) return null;
  const inDocs = file.startsWith(`${docsRoot}${path.sep}`);
  if (inDocs && /^\/(?:en\/)?resources\/ai-model\/harbor-examples\/?$/.test(pathname)) return null;
  const bases = pathname.startsWith('/')
    ? (inDocs ? [docsRoot, path.join(root, 'public'), root] : [root])
    : [path.dirname(file)];
  for (const base of bases) {
    const target = path.resolve(base, pathname.replace(/^\/+/, ''));
    const relative = path.relative(root, target);
    if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) continue;
    const candidates = [target];
    if (inDocs && !path.extname(target)) {
      candidates.push(`${target}.mdx`, path.join(target, 'index.mdx'));
    }
    for (const candidate of candidates) if (await isFile(candidate)) return null;
  }
  return `local link does not resolve: ${url}`;
}

export async function checkContent({ root = projectRoot } = {}) {
  root = path.resolve(root);
  const docsRoot = path.join(root, 'docs');
  const errors = [];
  const documents = (await filesUnder(docsRoot)).filter((file) => file.endsWith('.mdx'));
  const config = JSON.parse(await readFile(path.join(docsRoot, 'docs.json'), 'utf8'));
  const pages = navigationPages(config.navigation ?? config).filter((page) => !external(page));
  const slugs = new Set(documents.map((file) => pageSlug(file, docsRoot)));
  const listed = new Set(pages.map(normalizeSlug));
  for (const slug of listed) {
    if (!slugs.has(slug) && !/^(?:en\/)?resources\/ai-model\/harbor-examples$/.test(slug)) errors.push(`docs/docs.json: missing page ${slug}`);
  }
  for (const slug of slugs) if (!listed.has(slug)) errors.push(`docs/docs.json: page is not in navigation: ${slug}`);

  let resources = 0;
  const seen = new Map();
  for (const file of documents) {
    const name = slash(path.relative(root, file));
    const text = await readFile(file, 'utf8');
    errors.push(...frontmatterErrors(text).map((error) => `${name}: ${error}`));
    const english = name.startsWith('docs/en/');
    if (isResourceCatalog(pageSlug(file, docsRoot))) {
      for (const [index, line] of withoutCode(text).split('\n').entries()) {
        if (!/^\s*[-*]\s+/.test(line)) continue;
        const entry = /^- \[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.exec(line);
        if (!entry) { errors.push(`${name}:${index + 1}: resource needs a named HTTP(S) main link`); continue; }
        try { const parsed = new URL(entry[2]); if (!parsed.hostname) throw new Error(); }
        catch { errors.push(`${name}:${index + 1}: invalid resource URL: ${entry[2]}`); }
        const key = `${english ? 'en' : 'zh'}\n${entry[1].trim()}\n${entry[2]}`;
        if (seen.has(key)) errors.push(`${name}:${index + 1}: duplicate resource (${seen.get(key)}): ${entry[1]}`);
        else seen.set(key, `${name}:${index + 1}`);
        if (!english) resources += 1;
      }
    }
    const parsed = markdownLinks(text);
    errors.push(...parsed.errors.map((error) => `${name}: ${error}`));
    for (const link of parsed.links) {
      const error = await resolveMarkdownLink(link.url, file, root, docsRoot);
      if (error) errors.push(`${name}:${link.line}: ${error}`);
    }
  }
  if (config.navigation?.languages?.some(language => language.language === 'en')) {
    for (const file of documents) {
      const slug = pageSlug(file, docsRoot);
      const counterpart = slug.startsWith('en/') ? slug.slice(3) : `en/${slug}`;
      if (!slugs.has(counterpart)) { errors.push(`translation missing for ${slug}: ${counterpart}`); continue; }
      if (slug.startsWith('en/')) continue;
      const externalLinks = async (f) => markdownLinks(await readFile(f, 'utf8')).links.map(l => l.url).filter(external).sort();
      const original = await externalLinks(file);
      const translated = await externalLinks(path.join(docsRoot, `${counterpart}.mdx`));
      if (JSON.stringify(original) !== JSON.stringify(translated)) errors.push(`translation links differ: ${slug} / ${counterpart}`);
    }
  }
  for (const readmeName of ['README.md', 'README.en.md']) {
  const readmePath = path.join(root, readmeName);
  if (readmeName !== 'README.md' && !await isFile(readmePath)) continue;
  const readme = await readFile(readmePath, 'utf8');
  const parsedReadme = markdownLinks(readme);
  errors.push(...parsedReadme.errors.map((error) => `${readmeName}: ${error}`));
  const readmeLinks = [...parsedReadme.links,
    ...Array.from(readme.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi), (match) => ({ url: match[1], line: 1 }))];
  for (const link of readmeLinks) {
    const error = await resolveMarkdownLink(link.url, readmePath, root, docsRoot);
    if (error) errors.push(`${readmeName}:${link.line}: ${error}`);
  }
  }
  return { pages: documents.length, resources, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkContent();
    for (const error of result.errors) console.error(`✗ ${error}`);
    console.log(`Content: ${result.pages} pages, ${result.resources} resources; ${result.errors.length} errors.`);
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(`Content check failed: ${error.message}`); process.exitCode = 1; }
}
