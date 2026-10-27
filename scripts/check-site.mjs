import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const external = (value) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);

export function normalizeSiteBase(value = '/awesome-ai4chip/') {
  if (!value.startsWith('/') || /[?#\\]/.test(value) || value.includes('//') || value.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error(`SITE_BASE must be an absolute URL path: ${value}`);
  }
  return value === '/' ? '/' : `${value.replace(/\/$/, '')}/`;
}

function decodeEntities(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (whole, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()];
    const number = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return number >= 0 && number <= 0x10ffff ? String.fromCodePoint(number) : whole;
  });
}

function htmlTags(html) {
  const markup = html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<(script|style)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>)[\s\S]*?<\/\2\s*>/gi, '$1');
  return Array.from(markup.matchAll(/<([a-z][\w:-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi));
}

function attributes(tag) {
  return Array.from(tag.matchAll(/(?:^|\s)([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g),
    (match) => [match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4])]);
}

export function htmlReferences(html) {
  return htmlTags(html).flatMap((match) => attributes(match[0])
    .filter(([name]) => name === 'href' || name === 'src')
    .map(([attribute, url]) => ({ attribute, url })));
}

function htmlAnchors(html) {
  const anchors = new Set();
  for (const match of htmlTags(html)) {
    for (const [name, value] of attributes(match[0])) {
      if (name === 'id' || (match[1].toLowerCase() === 'a' && name === 'name')) anchors.add(value);
    }
  }
  return anchors;
}

async function filesUnder(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(file));
    else if (entry.isFile()) files.push(file);
  }
  return files.sort();
}

async function isFile(file) {
  try { return (await stat(file)).isFile(); }
  catch (error) { if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return false; throw error; }
}

async function targetFile(distDir, relative) {
  const target = path.resolve(distDir, relative);
  const fromRoot = path.relative(distDir, target);
  if (fromRoot === '..' || fromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(fromRoot)) return null;
  const candidates = [target, path.join(target, 'index.html')];
  if (!path.extname(relative)) candidates.push(`${target}.html`);
  for (const candidate of candidates) if (await isFile(candidate)) return candidate;
  return null;
}

export async function checkSite({ distDir = path.join(projectRoot, 'dist'), base = process.env.SITE_BASE ?? '/awesome-ai4chip/' } = {}) {
  distDir = path.resolve(distDir);
  base = normalizeSiteBase(base);
  const files = await filesUnder(distDir);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  const errors = [];
  if (!htmlFiles.length) errors.push('dist contains no HTML pages');
  const anchors = new Map();
  let localReferences = 0;
  for (const file of htmlFiles) {
    const relativeFile = path.relative(distDir, file).split(path.sep).join('/');
    const route = relativeFile.replace(/(?:^|\/)index\.html$/, (match) => match.startsWith('/') ? '/' : '');
    const pageUrl = new URL(`${base}${route}`, 'https://site.invalid');
    const html = await readFile(file, 'utf8');
    anchors.set(file, htmlAnchors(html));
    const seen = new Set();
    for (const { attribute, url: raw } of htmlReferences(html)) {
      const url = raw.trim();
      if (!url || url === '#' || external(url)) continue;
      const key = `${attribute}:${url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      localReferences += 1;
      const label = `${relativeFile}: ${attribute}=${JSON.stringify(url)}`;
      let parsed;
      try { parsed = new URL(url, pageUrl); }
      catch { errors.push(`${label}: invalid URL`); continue; }
      const pathname = parsed.pathname;
      if (base !== '/' && pathname !== base.slice(0, -1) && !pathname.startsWith(base)) {
        errors.push(`${label}: path is outside SITE_BASE ${base}`);
        continue;
      }
      let relative;
      let fragment;
      try {
        relative = decodeURIComponent(pathname === base.slice(0, -1) ? '' : pathname.slice(base.length));
        fragment = decodeURIComponent(parsed.hash.slice(1)).split(':~:text=', 1)[0];
      } catch { errors.push(`${label}: invalid URL encoding`); continue; }
      const target = await targetFile(distDir, relative);
      if (!target) { errors.push(`${label}: target file does not exist`); continue; }
      if (fragment && target.endsWith('.html')) {
        if (!anchors.has(target)) anchors.set(target, htmlAnchors(await readFile(target, 'utf8')));
        if (!anchors.get(target).has(fragment)) errors.push(`${label}: anchor #${fragment} does not exist`);
      }
    }
  }
  return { htmlFiles: htmlFiles.length, localReferences, base, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await checkSite();
    for (const error of result.errors.slice(0, 60)) console.error(`✗ ${error}`);
    if (result.errors.length > 60) console.error(`… ${result.errors.length - 60} more errors`);
    console.log(`Site: ${result.htmlFiles} HTML pages, ${result.localReferences} local references, base ${result.base}; ${result.errors.length} errors.`);
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(`Site check failed: ${error.message}`); process.exitCode = 1; }
}
