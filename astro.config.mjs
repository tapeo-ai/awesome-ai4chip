import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { mintlify } from '@mintlify/astro';
import { prepareDocs } from './scripts/prepare-docs.mjs';
import { siteUrl, base, remarkSiteLinks } from './scripts/site.mjs';
import { pageRedirects } from './scripts/redirects.mjs';

await prepareDocs();

export default defineConfig({
  site: siteUrl,
  base,
  output: 'static',
  trailingSlash: 'always',
  redirects: pageRedirects(),
  publicDir: './.generated-public',
  integrations: [
    mintlify({ docsDir: './.generated-docs' }),
    mdx(),
    {
      name: 'source-docs-watch',
      hooks: {
        'astro:server:setup': ({ server }) => {
          server.watcher.add(['docs', 'env/examples', 'assets', 'README.md', 'README.en.md']);
          let timer;
          server.watcher.on('all', (_event, file) => {
            const relative = file.replace(process.cwd() + '/', '');
            if (!/^(docs|env\/examples|assets)\//.test(relative) && !/^README(?:\.en)?\.md$/.test(relative)) return;
            clearTimeout(timer);
            timer = setTimeout(() => server.restart(), 250);
          });
        },
      },
    },
  ],
  markdown: { remarkPlugins: [remarkSiteLinks], shikiConfig: { theme: 'github-light' } },
  devToolbar: { enabled: false },
});
