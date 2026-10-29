import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { execute } = vi.hoisted(() => ({
  execute:
    vi.fn<(file: string, args: readonly string[], options?: unknown) => string>(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
beforeEach(() => {
  vi.resetModules();
  execute.mockReset().mockReturnValue('');
});

describe('type checking runner', () => {
  it('checks declarations, source, closed demo, and compiled docs', async () => {
    await import('./typecheck.mjs');
    const compiler = fileURLToPath(
      new URL('../node_modules/typescript/bin/tsc', import.meta.url),
    );
    expect(execute.mock.calls).toEqual(
      ['tsconfig.build.json', '.', 'demo', 'docs/examples'].map((project) => [
        process.execPath,
        [compiler, '-p', project],
        { stdio: 'inherit' },
      ]),
    );
  });
  it('preserves compiler failure and stops before later projects', async () => {
    const failure = new Error('Invalid source.');
    execute.mockReturnValueOnce('').mockImplementationOnce(() => {
      throw failure;
    });
    await expect(import('./typecheck.mjs')).rejects.toBe(failure);
    expect(execute).toHaveBeenCalledTimes(2);
  });
});
