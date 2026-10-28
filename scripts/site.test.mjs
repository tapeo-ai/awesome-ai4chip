import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeBase, pagePath, withBase, localeOf, localizedSlug, isResourceCatalog } from './site.mjs';
import { pageRedirects } from './redirects.mjs';

test('site URLs preserve queries and fragments under production and PR prefixes', () => {
  for (const base of ['/', '/awesome-ai4chip/', '/awesome-ai4chip/pr-preview/18/']) {
    assert.equal(withBase('/resources/models/llm?mode=all#监督微调', base), `${base}resources/models/llm/?mode=all#监督微调`);
    assert.equal(withBase('/assets/logo.png', base), `${base}assets/logo.png`);
    assert.equal(withBase('/environments/index', base), `${base}environments/`);
    assert.equal(withBase('/environments/task/task.toml', base), `${base}environments/task/task.toml`);
    assert.equal(withBase('https://example.org/a', base), 'https://example.org/a');
    assert.equal(withBase('#anchor', base), '#anchor');
    assert.equal(withBase('//example.org/a', base), '//example.org/a');
  }
});
test('language switches preserve the corresponding page including nested index routes', () => {
  for (const slug of ['index', 'resources/agents', 'environments/index', 'environments/task']) {
    const en = localizedSlug(slug, 'en');
    assert.equal(localeOf(en), 'en');
    assert.equal(localizedSlug(en, 'zh'), slug);
    assert.equal(localizedSlug(en, 'en'), en);
  }
  assert.equal(localizedSlug('en', 'zh'), 'index');
  assert.equal(pagePath(localizedSlug('en', 'en')), 'en/');
});
test('base and nested index normalization', () => {
  assert.equal(pagePath('index'), '');
  assert.equal(pagePath('environments/index'), 'environments/');
  assert.equal(pagePath('resources/agents'), 'resources/agents/');
  for (const bad of ['evil', '/../../', '/project', '//', '/x?y/']) assert.throws(() => normalizeBase(bad));
});

test('moved pages redirect to the matching language under production and PR prefixes', () => {
  for (const base of ['/', '/awesome-ai4chip/', '/awesome-ai4chip/pr-preview/18/']) {
    const redirects = pageRedirects(base);
    assert.equal(redirects['/resources/models/llm'], `${base}resources/ai-model/training/`);
    assert.equal(redirects['/en/resources/agents'], `${base}en/resources/eda/ai-eda/`);
    for (const prefix of ['', 'en/']) {
      assert.equal(redirects[`/${prefix}tutorials`], `${base}${prefix}guide/`);
      assert.equal(redirects[`/${prefix}guide/tutorials`], `${base}${prefix}guide/`);
      assert.equal(redirects[`/${prefix}guide/index`], `${base}${prefix}guide/`);
      assert.equal(redirects[`/${prefix}guide/eda-101`], `${base}${prefix}resources/eda/eda-101/`);
    }
    for (const [from, to] of Object.entries(redirects)) {
      assert.ok(to.startsWith(base));
      assert.equal(from.startsWith('/en/'), to.slice(base.length).startsWith('en/'));
      assert.ok(!Object.hasOwn(redirects, `/${to.slice(base.length).replace(/\/$/, '')}`), 'redirects should not form chains');
    }
  }
});

test('resource counts exclude explanatory pages in either language', () => {
  for (const prefix of ['', 'en/']) {
    assert.equal(isResourceCatalog(`${prefix}resources/eda/ai-eda`), true);
    assert.equal(isResourceCatalog(`${prefix}resources/eda/eda-101`), false);
    assert.equal(isResourceCatalog(`${prefix}guide`), false);
  }
});
