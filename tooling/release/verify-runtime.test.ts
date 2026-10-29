import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyPublicationRuntime } from './verify-runtime.js';

const { execute } = vi.hoisted(() => ({
  execute: vi.fn<() => string>(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
beforeEach(() => {
  execute.mockReset().mockReturnValue('11.19.0\n');
});

describe('publication runtime prerequisites', () => {
  it('checks the running Node version and npm without network or auth', () => {
    expect(() => verifyPublicationRuntime()).not.toThrow();
    expect(execute).toHaveBeenCalledExactlyOnceWith('npm', ['--version'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  });

  it.each(['26.0.0', '27.0.0'])(
    'accepts Node %s with npm minimum version',
    (node) => {
      execute.mockReturnValue('11.5.1');
      expect(() => verifyPublicationRuntime(node, execute)).not.toThrow();
    },
  );

  it.each(['25.9.0', '26.0.0-rc.1', 'invalid'])(
    'rejects incompatible Node %s before invoking npm',
    (node) => {
      expect(() => verifyPublicationRuntime(node)).toThrow('Node');
      expect(execute).not.toHaveBeenCalled();
    },
  );

  it.each(['11.5.0', '11.5.1-rc.1', 'invalid'])(
    'rejects incompatible npm %s',
    (npm) => {
      execute.mockReturnValue(npm);
      expect(() => verifyPublicationRuntime('26.0.0')).toThrow('npm');
    },
  );

  it('sanitizes command failures without exposing process output', () => {
    execute.mockImplementation(() => { throw new Error('sensitive stderr'); });
    expect(() => verifyPublicationRuntime('26.0.0')).toThrow('npm prerequisite');
    expect(() => verifyPublicationRuntime('26.0.0'))
      .not.toThrow('sensitive stderr');
  });
});
