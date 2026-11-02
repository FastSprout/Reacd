import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import { nativeSdkChunkGroups } from './tooling/build/native-sdk-groups.js';

const REACT_ARIA_PACKAGES = [
  'react-aria',
  'react-aria-components',
  'react-stately',
  '@react-(aria|stately)',
];
const REACT_ARIA_MODULES = new RegExp(
  String.raw`node_modules[\\/](${REACT_ARIA_PACKAGES.join('|')})[\\/]`,
);

const TEMPORAL_MODULES =
  /node_modules[\\/](@internationalized|@daypicker|react-day-picker|date-fns)[\\/]/;

const CHART_PACKAGES = [
  'recharts', 'victory-vendor', 'decimal\\.js-light', 'es-toolkit',
  '@reduxjs/toolkit', 'redux', 'redux-thunk', 'react-redux', 'reselect',
  'immer', 'eventemitter3', 'tiny-invariant',
];
const CHART_MODULES = new RegExp(
  String.raw`node_modules[\\/](${CHART_PACKAGES.join('|')})[\\/]`,
);

const SHADCN_CONTROL_PACKAGES = [
  '@shadcn',
  'input-otp',
  'react-resizable-panels',
  'react-hook-form',
  'cmdk',
];
const SHADCN_CONTROL_MODULES = new RegExp(
  String.raw`node_modules[\\/](${SHADCN_CONTROL_PACKAGES.join('|')})[\\/]`,
);

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
    new NodeURL('./tooling/site/public', import.meta.url),
  ),
  cacheDir: fileURLToPath(new NodeURL('./.cache/vite', import.meta.url)),
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@fastsprout/reacd/adapter-runtime/core': fileURLToPath(
        new NodeURL('./src/core/', import.meta.url),
      ),
      '@fastsprout/reacd/adapter-runtime/schema': fileURLToPath(
        new NodeURL('./src/schema/', import.meta.url),
      ),
      '@fastsprout/reacd/adapter-runtime/components': fileURLToPath(
        new NodeURL('./src/components/', import.meta.url),
      ),
      '@fastsprout/reacd/adapter-runtime/renderer': fileURLToPath(
        new NodeURL('./src/renderer/', import.meta.url),
      ),
      '@fastsprout/reacd-mui/styles.css': fileURLToPath(
        new NodeURL('./src/adapter/mui/styles.css', import.meta.url),
      ),
      '@fastsprout/reacd-mui/styles': fileURLToPath(
        new NodeURL('./src/adapter/mui/styles.ts', import.meta.url),
      ),
      '@fastsprout/reacd-mui': fileURLToPath(
        new NodeURL('./src/adapter/mui/mui.adapter.ts', import.meta.url),
      ),
      '@fastsprout/reacd-shadcn/styles.css': fileURLToPath(
        new NodeURL('./src/adapter/shadcn/styles.css', import.meta.url),
      ),
      '@fastsprout/reacd-shadcn/styles': fileURLToPath(
        new NodeURL('./src/adapter/shadcn/styles.ts', import.meta.url),
      ),
      '@fastsprout/reacd-shadcn': fileURLToPath(
        new NodeURL('./src/adapter/shadcn/shadcn.adapter.ts', import.meta.url),
      ),
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
      '@fastsprout/reacd/styles': fileURLToPath(
        new NodeURL('./src/styles.ts', import.meta.url),
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
      preserveEntrySignatures: false,
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            ...nativeSdkChunkGroups,
            { name: 'prosemirror', test: PROSEMIRROR_MODULES },
            { name: 'tiptap', test: /node_modules[\\/]@tiptap[\\/]/ },
            { name: 'chart-engine', test: CHART_MODULES },
            {
              name: 'react-aria',
              test: REACT_ARIA_MODULES,
            },
            {
              name: 'temporal',
              test: TEMPORAL_MODULES,
            },
            {
              name: 'react-runtime',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            { name: 'base-ui', test: /node_modules[\\/]@base-ui[\\/]/ },
            { name: 'radix-ui', test: /node_modules[\\/]@radix-ui[\\/]/ },
            {
              name: 'shadcn-controls',
              test: SHADCN_CONTROL_MODULES,
            },
            { name: 'validation', test: /node_modules[\\/]zod[\\/]/ },
          ],
        },
      },
    },
  },
});
