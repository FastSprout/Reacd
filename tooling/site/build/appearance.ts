import { resolve } from 'node:path';
import { build } from 'vite';
import { SITE_POLICY } from '../policy.js';

export async function buildAppearance(root: string): Promise<void> {
  await build({
    root,
    configFile: false,
    build: {
      outDir: resolve(root, SITE_POLICY.runtimeDirectory, 'assets'),
      emptyOutDir: false,
      lib: {
        entry: resolve(root, 'tooling/site/runtime/appearance-entry.ts'),
        formats: ['iife'],
        name: 'ReacdAppearance',
        fileName: 'appearance',
      },
    },
  });
}
