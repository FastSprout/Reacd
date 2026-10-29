import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

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
  root: 'demo',
  cacheDir: fileURLToPath(new URL('./.cache/vite', import.meta.url)),
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      'reacd/jsx-runtime': fileURLToPath(
        new URL('./src/jsx-runtime.ts', import.meta.url),
      ),
      'reacd/jsx-dev-runtime': fileURLToPath(
        new URL('./src/jsx-dev-runtime.ts', import.meta.url),
      ),
      'reacd/generative': fileURLToPath(
        new URL('./src/generative.ts', import.meta.url),
      ),
      reacd: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
    manifest: true,
    rolldownOptions: {
      input: {
        compositionSafety: fileURLToPath(
          new URL('./demo/composition-safety.html', import.meta.url),
        ),
        index: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
        temporalRecovery: fileURLToPath(
          new URL('./demo/temporal-recovery.html', import.meta.url),
        ),
        listboxFieldMetadata: fileURLToPath(
          new URL('./demo/listbox-field-metadata.html', import.meta.url),
        ),
        editorFieldMetadata: fileURLToPath(
          new URL('./demo/editor-field-metadata.html', import.meta.url),
        ),
      },
      output: {
        codeSplitting: {
          groups: [
            { name: 'prosemirror', test: PROSEMIRROR_MODULES },
            { name: 'tiptap', test: /node_modules[\\/]@tiptap[\\/]/ },
            {
              name: 'react-aria',
              test:
                /node_modules[\\/](react-aria-components|@react-(aria|stately))[\\/]/,
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
