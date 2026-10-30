import { defineConfig, mergeConfig } from 'vite';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import shared from './vite.config.js';

export default defineConfig(
  mergeConfig(
    shared,
    defineConfig({
      base: './',
      root: fileURLToPath(new NodeURL('./tooling/docs-preview', import.meta.url)),
      cacheDir: fileURLToPath(new NodeURL('./.cache/vite-docs', import.meta.url)),
      build: {
        outDir: fileURLToPath(
          new NodeURL('./.cache/docs-preview-dist', import.meta.url),
        ),
        rolldownOptions: {
          input: fileURLToPath(
            new NodeURL('./tooling/docs-preview/docs-preview.html', import.meta.url),
          ),
          output: {
            codeSplitting: {
              groups: [{ name: 'reacd-adapter', test: /[\\/]src[\\/]adapter[\\/]/ }],
            },
          },
        },
      },
    }),
  ),
);
