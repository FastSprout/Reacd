import { fileURLToPath, URL as NodeURL } from 'node:url';
import { expect, it } from 'vitest';
import site from '../../vite.site.config.js';

it('serves only the built MkDocs multi-page site through Vite preview', () => {
  expect(site).toEqual({
    root: fileURLToPath(new NodeURL('../../', import.meta.url)),
    appType: 'mpa',
    build: {
      outDir: fileURLToPath(new NodeURL('../../site', import.meta.url)),
    },
    preview: {
      host: '127.0.0.1',
    },
  });
});
