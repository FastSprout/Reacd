import { beforeEach, expect, it, vi } from 'vitest';
const { execute } = vi.hoisted(() => ({
  execute: vi.fn<(file: string, args: readonly string[], options?: unknown) => void>(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
beforeEach(() => {
  vi.resetModules();
  execute.mockReset();
});
it('builds the framework, browser assets and owned Markdown site', async () => {
  await import('./docs.mjs');
  expect(execute).toHaveBeenCalledTimes(3);
  const calls = execute.mock.calls;
  expect(calls.every((call) => call[0] === process.execPath)).toBe(true);
  expect(calls.at(0)?.[1][0]).toMatch(/scripts\/build\.mjs$/);
  expect(calls.at(1)?.[1]).toContain('vite.site-build.config.ts');
  expect(calls.at(2)?.[1][0]).toBe('--import');
  expect(calls.at(2)?.[1][2]).toMatch(/scripts\/site-build\.ts$/);
});
it.each([1, 2, 3])('stops when documentation stage %s fails', async (stage) => {
  execute.mockImplementationOnce(() => {
    if (stage === 1) throw new Error('stage');
  });
  execute.mockImplementationOnce(() => {
    if (stage === 2) throw new Error('stage');
  });
  execute.mockImplementationOnce(() => {
    if (stage === 3) throw new Error('stage');
  });
  await expect(import('./docs.mjs')).rejects.toThrow('stage');
  expect(execute).toHaveBeenCalledTimes(stage);
});
