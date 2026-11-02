import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vite';
import shared from './vite.config.js';
import { runtimeModuleManifest } from './tooling/site/build/runtime-modules.js';

export default defineConfig(
  mergeConfig(
    shared,
    defineConfig({
      base: '/',
      publicDir: false,
      plugins: [runtimeModuleManifest()],
      build: {
        outDir: '.cache/site-runtime-dist',
        cssCodeSplit: false,
        rolldownOptions: {
          input: fileURLToPath(
            new URL('./tooling/site/runtime/client.tsx', import.meta.url),
          ),
          preserveEntrySignatures: false,
          output: {
            strictExecutionOrder: true,
            entryFileNames: 'assets/site.js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: (asset) =>
              asset.names.some((name) => name.endsWith('.css'))
                ? 'assets/site.css'
                : 'assets/[name]-[hash][extname]',
            codeSplitting: {
              includeDependenciesRecursively: false,
            },
          },
        },
      },
    }),
  ),
);
