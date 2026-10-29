import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { execute, report } = vi.hoisted(() => ({
  execute:
    vi.fn<(file: string, args: readonly string[], options?: unknown) => string>(),
  report: vi.fn<(message: string) => void>(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
beforeEach(() => {
  vi.resetModules();
  execute.mockReset().mockReturnValue('');
  report.mockReset();
  vi.stubEnv('GITHUB_ACTIONS', undefined);
  vi.spyOn(console, 'error').mockImplementation(report);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('main check runner', () => {
  it.each([undefined, 'true'])(
    'runs every gate without failure annotations for GITHUB_ACTIONS=%s',
    async (hosted) => {
      vi.stubEnv('GITHUB_ACTIONS', hosted);
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
      expect(report).not.toHaveBeenCalled();
    },
  );
  it.each([undefined, 'false', 'TRUE', 'local'])(
    'propagates failure without annotations for GITHUB_ACTIONS=%s',
    async (hosted) => {
      vi.stubEnv('GITHUB_ACTIONS', hosted);
      const failure = new Error('Type checking failed.');
      execute.mockReturnValueOnce('').mockImplementationOnce(() => {
        throw failure;
      });
      await expect(import('./check.mjs')).rejects.toBe(failure);
      expect(execute.mock.calls.map((call) => call[1])).toEqual([
        ['run', 'policy'],
        ['run', 'typecheck'],
      ]);
      expect(report).not.toHaveBeenCalled();
    },
  );

  it.each([
    new Error('secret-token\n::error::Untrusted child output'),
    'secret-token\n::error::Untrusted thrown value',
  ])(
    'annotates only the fixed failed gate and preserves its failure',
    async (failure) => {
      vi.stubEnv('GITHUB_ACTIONS', 'true');
      execute.mockReturnValueOnce('').mockImplementationOnce(() => {
        throw failure;
      });
      await expect(import('./check.mjs')).rejects.toBe(failure);
      expect(execute.mock.calls.map((call) => call[1])).toEqual([
        ['run', 'policy'],
        ['run', 'typecheck'],
      ]);
      expect(report).toHaveBeenCalledExactlyOnceWith(
        '::error title=Check gate failed::typecheck',
      );
    },
  );
});
