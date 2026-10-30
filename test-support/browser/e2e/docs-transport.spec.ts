import { expect, test } from '@playwright/test';
import { z } from 'zod';

const SITE_ORIGIN = 'http://127.0.0.1:4175';
const PREVIEW_URL = `${SITE_ORIGIN}/assets/previews/docs-preview.html`;
const TRANSPORT_POLICY = { concurrentCopies: 3 } as const;

test('MkDocs serves concurrent preview and search assets with real 404s', async ({
  request,
}) => {
  const entry = await request.get(PREVIEW_URL);
  expect(entry.status()).toBe(200);
  expect(entry.headers()['content-type']).toContain('text/html');
  const html = await entry.text();
  const assetPaths = z
    .array(z.string())
    .min(1)
    .parse(Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]));
  const assets = assetPaths.map((path) => {
    expect(path).toMatch(/\.(?:css|js)$/);
    return {
      url: new URL(path, PREVIEW_URL).href,
      mime: path.endsWith('.css') ? 'text/css' : 'text/javascript',
    };
  });
  const requests = [
    ...assets,
    { url: `${SITE_ORIGIN}/components/switch/`, mime: 'text/html' },
    { url: `${SITE_ORIGIN}/search/worker.js`, mime: 'text/javascript' },
    { url: `${SITE_ORIGIN}/search/lunr.js`, mime: 'text/javascript' },
    { url: `${SITE_ORIGIN}/search/search_index.json`, mime: 'application/json' },
  ];
  await Promise.all(
    Array.from({ length: TRANSPORT_POLICY.concurrentCopies }, () =>
      requests.map(async ({ url, mime }) => {
        const response = await request.get(url);
        expect(response.status(), url).toBe(200);
        expect(response.headers()['content-type'], url).toContain(mime);
        expect((await response.body()).byteLength, url).toBeGreaterThan(0);
      }),
    ).flat(),
  );
  for (const path of ['/missing-documentation-route/', '/missing-module.js']) {
    const response = await request.get(`${SITE_ORIGIN}${path}`);
    expect(response.status(), path).toBe(404);
  }
});
