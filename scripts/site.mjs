export const repoUrl = 'https://github.com/tapeo-ai/awesome-ai4chip';
export const siteUrl = 'https://tapeo-ai.github.io';
export const productionBase = '/awesome-ai4chip/';
export function normalizeBase(value = productionBase) {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(value)) {
    throw new Error(`Invalid SITE_BASE: ${value}. Use a leading and trailing slash.`);
  }
  return value;
}
export const base = normalizeBase(process.env.SITE_BASE);
export function pagePath(slug) {
  return slug === 'index' ? '' : slug.replace(/\/index$/, '') + '/';
}
export function localeOf(slug) { return slug === 'en' || slug.startsWith('en/') ? 'en' : 'zh'; }
export function localizedSlug(slug, locale) {
  const plain = slug === 'en' ? 'index' : slug.replace(/^en\//, '');
  return locale === 'en' ? `en/${plain}` : plain;
}
export function withBase(url, siteBase = base) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  if (siteBase !== '/' && url.startsWith(siteBase)) return url;
  const relative = url.slice(1);
  const split = relative.search(/[?#]/);
  const path = split === -1 ? relative : relative.slice(0, split);
  const suffix = split === -1 ? '' : relative.slice(split);
  const normalized = path.replace(/(^|\/)index$/, '$1');
  const trailing = normalized && !normalized.endsWith('/') && !/\.[a-z0-9]+$/i.test(normalized) ? '/' : '';
  return siteBase + normalized + trailing + suffix;
}
export function remarkSiteLinks() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'link' || node.type === 'image' || node.type === 'definition') node.url = withBase(node.url);
      for (const attribute of node.attributes || []) {
        if (['href', 'src'].includes(attribute.name) && typeof attribute.value === 'string') attribute.value = withBase(attribute.value);
      }
      for (const child of node.children || []) walk(child);
    };
    walk(tree);
  };
}
