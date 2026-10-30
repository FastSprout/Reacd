import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL as NodeURL } from 'node:url';

const REACT_ARIA_MODULES =
  /node_modules[\\/](react-aria-components|@react-(aria|stately))[\\/]/;

const PROSEMIRROR_PACKAGES = [
  String.raw`prosemirror-[^\\/]+`,
  'orderedmap',
  'rope-sequence',
  'w3c-keyname',
];
const PROSEMIRROR_MODULES = new RegExp(
  String.raw`node_modules[\\/](${PROSEMIRROR_PACKAGES.join('|')})[\\/]`,
);

export default defineConfig({
  publicDir: fileURLToPath(
    new NodeURL('./tooling/docs-preview/public', import.meta.url),
  ),
  cacheDir: fileURLToPath(new NodeURL('./.cache/vite', import.meta.url)),
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@fastsprout/reacd/jsx-runtime': fileURLToPath(
        new NodeURL('./src/jsx-runtime.ts', import.meta.url),
      ),
      '@fastsprout/reacd/jsx-dev-runtime': fileURLToPath(
        new NodeURL('./src/jsx-dev-runtime.ts', import.meta.url),
      ),
      '@fastsprout/reacd/generative': fileURLToPath(
        new NodeURL('./src/generative.ts', import.meta.url),
      ),
      '@fastsprout/reacd/bootstrap': fileURLToPath(
        new NodeURL('./src/bootstrap.ts', import.meta.url),
      ),
      '@fastsprout/reacd': fileURLToPath(
        new NodeURL('./src/index.ts', import.meta.url),
      ),
    },
  },
  build: {
    emptyOutDir: true,
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'prosemirror', test: PROSEMIRROR_MODULES },
            { name: 'tiptap', test: /node_modules[\\/]@tiptap[\\/]/ },
            {
              name: 'react-aria',
              test: REACT_ARIA_MODULES,
            },
            {
              name: 'temporal',
              test: /node_modules[\\/](@internationalized|@daypicker)[\\/]/,
            },
            {
              name: 'react-runtime',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            { name: 'base-ui', test: /node_modules[\\/]@base-ui[\\/]/ },
            { name: 'radix-ui', test: /node_modules[\\/]@radix-ui[\\/]/ },
            { name: 'validation', test: /node_modules[\\/]zod[\\/]/ },
          ],
        },
      },
    },
  },
});
