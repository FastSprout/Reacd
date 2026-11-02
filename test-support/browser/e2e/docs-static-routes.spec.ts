import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { loadSite } from '../../../tooling/site/content/index.js';
import { sitePayloadSchema } from '../../../tooling/site/content/model.schema.js';
import { COMPONENT_NAMES } from '../../../src/components/component-names.js';
import { DOCS_BROWSER_POLICY as POLICY } from '../docs-site.js';

const manifest = await loadSite(process.cwd());

test('the static inventory covers every source page and component reference', () => {
  expect(manifest.pages.length).toBeGreaterThan(COMPONENT_NAMES.length);
  expect(new Set(manifest.pages.map((page) => page.route)).size).toBe(
    manifest.pages.length,
  );
});

for (const page of manifest.pages) {
  test(`SSR and validated data preserve ${page.route}`, async ({ request }) => {
    const [html, data, source] = await Promise.all([
      request.get(page.route),
      request.get(`${page.route}index.json`),
      request.get(`${page.route}index.md`),
    ]);
    expect(html.status()).toBe(200);
    expect(html.headers()['content-type']).toContain('text/html');
    const body = await html.text();
    expect(body).toMatch(/^<!doctype html>/);
    expect(body.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(body).toMatch(/<main\b|role="main"/);
    expect(body).toContain(`href="${POLICY.canonicalOrigin}${page.route}"`);
    expect(body).toContain('data-adapter="shadcn-ui"');
    expect(body).not.toMatch(
      /<iframe\b|data-reacd-chrome|<script[^>]+(?:mkdocs|lunr)/i,
    );
    expect(data.status()).toBe(200);
    expect(data.headers()['content-type']).toContain('application/json');
    const value: unknown = await data.json();
    expect(sitePayloadSchema.parse(value).page).toEqual(page);
    expect(source.status()).toBe(200);
    expect(await source.text()).toBe(page.source);
  });
}

test('compiled/source assets are served and internal paths remain unavailable', async ({
  request,
}) => {
  for (const [path, type] of [
    ['/assets/site.js', 'javascript'],
    ['/assets/site.css', 'text/css'],
    ['/sitemap.xml', 'xml'],
    ['/robots.txt', 'text/plain'],
  ]) {
    if (!path || !type) throw new Error('Asset acceptance requires a path and MIME');
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).toContain(type);
    expect((await response.body()).byteLength, path).toBeGreaterThan(0);
  }
  const source = await request.get('/examples/input.tsx');
  expect(source.status()).toBe(200);
  expect(await source.text()).toBe(await readFile('docs/examples/input.tsx', 'utf8'));
  for (const path of [
    '/missing-documentation/',
    '/missing-module.js',
    '/specs/site-generator.md',
    '/AGENTS.md',
    '/site.config.yml',
    '/tooling/site/content/load.ts',
    '/node_modules/react/index.js',
    '/runtime-modules.json',
    '/.vite/manifest.json',
    '/examples/button.test.tsx',
    '/examples/tsconfig.json',
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
