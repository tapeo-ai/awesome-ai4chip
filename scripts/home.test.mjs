import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { homepageBody, syncHome } from './home.mjs';

test('README homepage conversion retains guidance and maps repo links in both languages', () => {
  for (const locale of ['zh', 'en']) {
    const prefix = locale === 'en' ? 'en/' : '';
    const source = `<h1 align="center"><img src="assets/logo.png"> Awesome</h1>
<p align="center"><a href="README.md">中文</a> · English</p>
![Architecture](assets/architecture.png)
<!-- website-link:start -->
[Online](https://example.com)
<!-- website-link:end -->
<sub>Updated today.</sub>
<!-- guide:start -->
## Guide
[Course](https://example.org/learn)
[Data](docs/${prefix}resources/ai-model/data.mdx#datasets)
[Harbor](env/examples/task/README.md)
<!-- guide:end -->
<p align="center"><img src="assets/qr.jpg" width="300"></p>`;
    const result = homepageBody(source, locale);
    assert.ok(result.startsWith('![Architecture](/assets/architecture.png)'));
    assert.ok(result.includes(`[Data](/${prefix}resources/ai-model/data#datasets)`));
    assert.ok(result.includes(`[Harbor](/${prefix}resources/ai-model/harbor-examples)`));
    assert.ok(result.includes('## Guide\n[Course](https://example.org/learn)'));
    assert.ok(result.includes('<img src="/assets/qr.jpg" width="300" />'));
    assert.doesNotMatch(result, /<h1|README\.md|<!--|Updated today|https:\/\/example\.com/);
  }
});

test('homepage sync detects stale translations and preserves page metadata', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ai4chip-home-'));
  try {
    await mkdir(join(root, 'docs/en'), { recursive: true });
    for (const [readme, page] of [['README.md', 'docs/index.mdx'], ['README.en.md', 'docs/en/index.mdx']]) {
      await writeFile(join(root, readme), '## Guide\n\nA reading path.\n');
      await writeFile(join(root, page), '---\ntitle: Awesome\nupdated: "2026-10-28"\n---\n\nOld content.\n');
    }
    await assert.rejects(syncHome(root, { check: true }), /out of sync/);
    await syncHome(root);
    await syncHome(root, { check: true });
    assert.match(await readFile(join(root, 'docs/index.mdx'), 'utf8'), /updated: "2026-10-28"[\s\S]*A reading path/);
    await writeFile(join(root, 'README.en.md'), '## Guide\n\nUpdated path.\n');
    await assert.rejects(syncHome(root, { check: true }), /docs\/en\/index/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
