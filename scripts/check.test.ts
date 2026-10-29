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

describe('main check runner', () => {
  it('runs every local gate in dependency order without deployment', async () => {
    await import('./check.mjs');
    expect(execute.mock.calls).toEqual(
      [
        'policy',
        'typecheck',
        'lint',
        'schema:check',
        'examples:check',
        'test:coverage',
        'build',
        'test:package',
        'docs:check',
        'test:browser',
      ].map((name) => ['npm', ['run', name], { stdio: 'inherit' }]),
    );
  });
  it('propagates the first failure and never starts subsequent gates', async () => {
    const failure = new Error('Type checking failed.');
    execute.mockReturnValueOnce('').mockImplementationOnce(() => {
      throw failure;
    });
    await expect(import('./check.mjs')).rejects.toBe(failure);
    expect(execute.mock.calls.map((call) => call[1])).toEqual([
      ['run', 'policy'],
      ['run', 'typecheck'],
    ]);
  });
});
