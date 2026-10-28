import { readdir, readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { resolve, join, relative, dirname } from 'node:path';
import { generateHarbor } from './harbor.mjs';
import { repoUrl, siteUrl, base, pagePath, productionBase, isResourceCatalog } from './site.mjs';

export async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = await Promise.all(entries.map(e => e.isDirectory() ? filesIn(join(dir, e.name)) : [join(dir, e.name)]));
  return result.flat();
}
export async function syncLatest(root = process.cwd(), { check = false } = {}) {
 for (const [sourceFile, readmeFile] of [['docs/latest.mdx', 'README.md'], ['docs/en/latest.mdx', 'README.en.md']]) {
  const source = await readFile(join(root, sourceFile), 'utf8');
  const latest = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
  const file = join(root, readmeFile);
  const current = await readFile(file, 'utf8');
  if (!current.includes('<!-- latest:start -->') || !current.includes('<!-- latest:end -->')) throw new Error('README Latest markers are missing.');
  const next = current.replace(/<!-- latest:start -->[\s\S]*?<!-- latest:end -->/, `<!-- latest:start -->\n\n${latest}\n\n<!-- latest:end -->`);
  if (next === current) continue;
  if (check) throw new Error(`${readmeFile} Latest is out of sync. Run npm run docs:sync.`);
  await writeFile(file, next);
 }
}
export async function prepareDocs() {
  const root = process.cwd();
  const outputDir = resolve(root, '.generated-docs');
  const publicDir = resolve(root, '.generated-public');
  await Promise.all([rm(outputDir, { recursive: true, force: true }), rm(publicDir, { recursive: true, force: true })]);
  await cp(join(root, 'docs'), outputDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });
  await mkdir(join(publicDir, 'assets'), { recursive: true });
  const publicAssets = [
    'awesome-ai4chip-logo.png', 'ai4chip-architecture.png', 'eda-design-flow.svg',
    'eda-101/verdi-debug.jpg', 'eda-101/innovus-berkeley-layout.png',
    'eda-101/openroad-ibex-gui.webp', 'eda-101/calibre-rve-soft-checks.jpg',
    'eda-101/xschem-ngspice.png', 'eda-101/openlane-asic-flow.webp',
    'eda-101/synopsys-ai-chip-flow.png', 'eda-101/chipagents-build-a-chip-bench-figure-3.png',
  ];
  for (const name of publicAssets) {
    const target = join(publicDir, 'assets', name);
    await mkdir(dirname(target), { recursive: true });
    await cp(join(root, 'assets', name), target);
  }
  const environments = [];
  for (const locale of ['zh', 'en']) environments.push(...await generateHarbor({ root, outputDir, publicDir, repoUrl, branch: 'main', locale }));
  const config = JSON.parse(await readFile(join(outputDir, 'docs.json'), 'utf8'));
  for (const language of config.navigation.languages) {
    const prefix = language.language === 'en' ? 'en/' : '';
    const environmentGroup = language.groups.find(g => g.pages.includes(`${prefix}environments/index`));
    environmentGroup.pages.push(...environments.filter(e => e.slug.startsWith(`${prefix}environments/`)).map(e => e.slug));
  }
  await writeFile(join(outputDir, 'docs.json'), JSON.stringify(config, null, 2) + '\n');
  const sources = {};
  const texts = [];
  const urls = [];
  const list = ['# Awesome AI4Chip', '', '> AI for Chip 与 Chip / Infra Co-design 的研究、工具与实践目录。', '', '## Pages', ''];
  for (const file of (await filesIn(outputDir)).filter(f => f.endsWith('.mdx')).sort()) {
    const slug = relative(outputDir, file).replace(/\\/g, '/').replace(/\.mdx$/, '');
    const content = await readFile(file, 'utf8');
    const title = content.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] || slug;
    const task = environments.find(e => e.slug === slug);
    sources[slug] = task?.source || (slug === 'environments/index' ? 'env/README.md' : slug === 'en/environments/index' ? 'env/README.en.md' : `docs/${slug}.mdx`);
    const rawDir = join(publicDir, 'source', ...slug.split('/').slice(0, -1));
    await mkdir(rawDir, { recursive: true });
    await writeFile(join(publicDir, 'source', `${slug}.md`), content);
    list.push(`- [${title}](${siteUrl}${base}source/${slug}.md)`);
    texts.push(`# ${title}\n\n${content.replace(/^---\n[\s\S]*?\n---\n/, '')}`);
    urls.push(`${siteUrl}${base}${pagePath(slug)}`);
  }
  const resourceFiles = (await filesIn(join(root, 'docs/resources'))).filter(f =>
    f.endsWith('.mdx') && isResourceCatalog(relative(join(root, 'docs'), f).replace(/\\/g, '/').replace(/\.mdx$/, '')));
  let resources = 0;
  for (const f of resourceFiles) resources += (await readFile(f, 'utf8')).split('\n').filter(l => /^- \[[^\]]+\]\(https?:/.test(l)).length;
  await writeFile(join(outputDir, 'site-meta.json'), JSON.stringify({ sources, resources, environments: environments.filter(e => !e.slug.startsWith('en/')).length }, null, 2));
  await writeFile(join(publicDir, 'llms.txt'), list.join('\n') + '\n');
  await writeFile(join(publicDir, 'llms-full.txt'), texts.join('\n\n---\n\n'));
  await writeFile(join(publicDir, '.nojekyll'), '');
  const preview = base !== productionBase;
  await writeFile(join(publicDir, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: ${productionBase}pr-preview/\nSitemap: ${siteUrl}${base}sitemap.xml\n`);
  await writeFile(join(publicDir, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map(url => `<url><loc>${url}</loc></url>`).join('') + '</urlset>\n');
}
if (process.argv.includes('--sync-latest')) await syncLatest();
if (process.argv.includes('--check-latest')) await syncLatest(process.cwd(), { check: true });
