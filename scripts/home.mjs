import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** README is the homepage content source; retain only each MDX page's metadata. */
export function homepageBody(readme, locale = 'zh') {
  const prefix = locale === 'en' ? '/en' : '';
  let body = readme
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>\s*/, '')
    .replace(/<p align="center">[^\n]*(?:README\.en\.md|README\.md)[^\n]*<\/p>\s*/, '')
    .replace(/<!-- website-link:start -->[\s\S]*?<!-- website-link:end -->/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<sub>[^<]*<\/sub>\s*/g, '');
  const siteLink = (url) => {
    if (/^(?:https?:|mailto:|#|\/)/.test(url)) return url;
    if (/^docs\/(?:en\/)?guide\.mdx/.test(url)) return `${prefix}/#guide`;
    if (/^docs\//.test(url)) return '/' + url.slice(5).replace(/\.mdx(?=[?#]|$)/, '').replace(/\/index(?=[?#]|$)/, '/');
    if (/^env\/(?:examples\/.*|README(?:\.en)?\.md)/.test(url)) return `${prefix}/resources/ai-model/harbor-examples`;
    if (url.startsWith('assets/')) return '/' + url;
    return url;
  };
  body = body.replace(/(!?\[[^\]\n]*\]\()([^\s)]+)(\))/g, (_m, start, url, end) => start + siteLink(url) + end);
  body = body.replace(/\b(src|href)="([^"]+)"/g, (_m, attr, url) => `${attr}="${siteLink(url)}"`);
  body = body.replace(/<img\b([^>]*?)(?:\s*\/)?\s*>/g, '<img$1 />');
  return body.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export async function syncHome(root = process.cwd(), { check = false, outputDir } = {}) {
  for (const [locale, readmeName, docName] of [['zh', 'README.md', 'docs/index.mdx'], ['en', 'README.en.md', 'docs/en/index.mdx']]) {
    const [readme, current] = await Promise.all([readFile(join(root, readmeName), 'utf8'), readFile(join(root, docName), 'utf8')]);
    const metadata = current.match(/^---\r?\n[\s\S]*?\r?\n---/)?.[0];
    if (!metadata) throw new Error(`Homepage metadata missing: ${docName}`);
    const next = `${metadata}\n\n${homepageBody(readme, locale)}`;
    if (next === current) continue;
    if (check) throw new Error(`${docName} is out of sync with ${readmeName}. Run npm run docs:sync.`);
    await writeFile(outputDir ? join(outputDir, docName.replace(/^docs\//, '')) : join(root, docName), next);
  }
}
