import { defineConfig, mergeConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import demo from './vite.config.js';

export default mergeConfig(
  demo,
  defineConfig({
    base: './',
    cacheDir: fileURLToPath(new URL('./.cache/vite-docs', import.meta.url)),
    build: {
      outDir: '../.cache/docs-preview-dist',
      rolldownOptions: {
        input: fileURLToPath(new URL('./demo/docs-preview.html', import.meta.url)),
        output: {
          codeSplitting: {
            groups: [{ name: 'reacd-adapter', test: /[\\/]src[\\/]adapter[\\/]/ }],
          },
        },
      },
    },
  }),
);
