import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { execute, remove } = vi.hoisted(() => ({
  execute:
    vi.fn<(file: string, args: readonly string[], options?: unknown) => string>(),
  remove: vi.fn<(path: URL, options: unknown) => void>(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
vi.mock('node:fs', () => ({ rmSync: remove, copyFileSync: vi.fn() }));
const compiler = fileURLToPath(
  new URL('../node_modules/typescript/bin/tsc', import.meta.url),
);
const vite = fileURLToPath(
  new URL('../node_modules/vite/bin/vite.js', import.meta.url),
);
beforeEach(() => {
  vi.resetModules();
  execute.mockReset().mockReturnValue('');
  remove.mockReset();
});

describe('production build runner', () => {
  it('builds CSS and private conformance after clearing stale output', async () => {
    await import('./build.mjs');
    expect(remove).toHaveBeenNthCalledWith(1, new URL('../dist/', import.meta.url), {
      recursive: true,
      force: true,
    });
    expect(remove).toHaveBeenNthCalledWith(
      2,
      new URL('../packages/shadcn/dist/', import.meta.url),
      { recursive: true, force: true },
    );
    expect(remove.mock.invocationCallOrder[2]).toBeLessThan(
      execute.mock.invocationCallOrder[0] ?? 0,
    );
    expect(execute.mock.calls).toEqual([
      [process.execPath, [compiler, '-p', 'tsconfig.build.json'], { stdio: 'inherit' }],
      [
        process.execPath,
        [compiler, '-p', 'packages/shadcn/tsconfig.build.json'],
        { stdio: 'inherit' },
      ],
      [
        process.execPath,
        [compiler, '-p', 'packages/mui/tsconfig.build.json'],
        { stdio: 'inherit' },
      ],
      [
        process.execPath,
        [vite, 'build', '--config', 'vite.styles.config.ts'],
        { stdio: 'inherit' },
      ],
      [
        process.execPath,
        [vite, 'build', '--config', 'vite.mui-styles.config.ts'],
        { stdio: 'inherit' },
      ],
      [
        process.execPath,
        [vite, 'build', '--config', 'vite.conformance.config.ts'],
        { stdio: 'inherit' },
      ],
      [
        process.execPath,
        [
          '--import',
          'tsx',
          fileURLToPath(new URL('./bundle-check.ts', import.meta.url)),
        ],
        { stdio: 'inherit' },
      ],
      ...['counter', 'form', 'dashboard'].map((mode) => [
        process.execPath,
        [vite, 'build', '--config', 'vite.examples.config.ts', '--mode', mode],
        { stdio: 'inherit' },
      ]),
    ]);
  });
  it('does not compile when stale output cannot be removed', async () => {
    const failure = new Error('Cannot remove output.');
    remove.mockImplementation(() => {
      throw failure;
    });
    await expect(import('./build.mjs')).rejects.toBe(failure);
    expect(execute).not.toHaveBeenCalled();
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    'stops on build stage %s failure',
    async (stage) => {
      const failure = new Error('Build failed.');
      execute.mockImplementation(() => {
        if (execute.mock.calls.length === stage) throw failure;
        return '';
      });
      await expect(import('./build.mjs')).rejects.toBe(failure);
      expect(execute).toHaveBeenCalledTimes(stage);
    },
  );
});
