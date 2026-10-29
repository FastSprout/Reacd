import { beforeEach, expect, it, vi } from 'vitest';
const { execute } = vi.hoisted(() => ({
  execute: vi.fn<(file: string, args: readonly string[], options?: unknown) => void>(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
beforeEach(() => {
  vi.resetModules();
  execute.mockReset();
});
it('checks source, compiles previews, builds and validates MkDocs', async () => {
  await import('./docs.mjs');
  expect(execute).toHaveBeenCalledTimes(4);
  expect(execute.mock.calls.at(0)?.at(1)).toContain('--source');
  expect(execute.mock.calls.at(1)?.at(1)).toContain('vite.docs.config.ts');
  expect(execute.mock.calls.at(2)).toEqual([
    '.venv-docs/bin/python',
    ['-m', 'mkdocs', 'build', '--strict'],
    { stdio: 'inherit' },
  ]);
  expect(execute.mock.calls.at(3)?.at(1)).not.toContain('--source');
});
it.each([1, 2, 3, 4])('stops when documentation stage %s fails', async (stage) => {
  execute.mockImplementationOnce(() => {
    if (stage === 1) throw new Error('stage');
  });
  execute.mockImplementationOnce(() => {
    if (stage === 2) throw new Error('stage');
  });
  execute.mockImplementationOnce(() => {
    if (stage === 3) throw new Error('stage');
  });
  execute.mockImplementationOnce(() => {
    if (stage === 4) throw new Error('stage');
  });
  await expect(import('./docs.mjs')).rejects.toThrow('stage');
  expect(execute).toHaveBeenCalledTimes(stage);
});
