import { expect, it, vi } from 'vitest';
import { build } from 'vite';
import { buildAppearance } from './appearance.js';

vi.mock('vite', () => ({ build: vi.fn() }));

it('builds a standalone blocking bootstrap without replacing site assets', async () => {
  await buildAppearance('/workspace');
  expect(build).toHaveBeenCalledWith({
    root: '/workspace',
    configFile: false,
    build: {
      outDir: '/workspace/.cache/site-runtime-dist/assets',
      emptyOutDir: false,
      lib: {
        entry: '/workspace/tooling/site/runtime/appearance-entry.ts',
        formats: ['iife'],
        name: 'ReacdAppearance',
        fileName: 'appearance',
      },
    },
  });
});
