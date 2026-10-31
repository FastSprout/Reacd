import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createReleaseGitHub, resolveReleaseTag } from './github-client.js';
import type { ReleaseGitHub } from './github-client.js';

const exec = vi.hoisted(() => vi.fn<() => string>());
vi.mock('node:child_process', () => ({ execFileSync: exec }));
beforeEach(() => exec.mockReset().mockReturnValue('{}'));

describe('fixed-repository GitHub release client', () => {
  it('uses argument arrays and stdin JSON without exposing credentials', () => {
    const client = createReleaseGitHub();
    expect(client.get('releases/tags/v0.2.0')).toEqual({});
    client.patch('releases/1', { draft: false });
    expect(exec).toHaveBeenNthCalledWith(
      1,
      'gh',
      ['api', '--method', 'GET', 'repos/FastSprout/Reacd/releases/tags/v0.2.0'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
    );
    expect(exec).toHaveBeenNthCalledWith(
      2,
      'gh',
      ['api', '--method', 'PATCH', 'repos/FastSprout/Reacd/releases/1', '--input', '-'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], input: '{"draft":false}' },
    );
    client.upload('v0.2.0', '/checked/archive.tgz');
    expect(exec).toHaveBeenLastCalledWith(
      'gh',
      [
        'release',
        'upload',
        'v0.2.0',
        '/checked/archive.tgz',
        '--repo',
        'FastSprout/Reacd',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
  });
  it('sanitizes execution and malformed response failures', () => {
    const client = createReleaseGitHub();
    exec.mockImplementation(() => {
      throw new Error('secret-token');
    });
    expect(() => client.get('releases')).toThrow('GitHub release request failed.');
    expect(() => client.upload('v0.2.0', '/checked.tgz')).toThrow(
      'GitHub release asset upload failed.',
    );
    exec.mockReturnValue('not JSON');
    expect(() => client.get('releases')).toThrow('response is invalid');
  });
  it('rejects nested annotated tags and invalid external references', () => {
    const get = vi.fn<ReleaseGitHub['get']>().mockReturnValue({
      object: { type: 'tag', sha: 'a'.repeat(40) },
    });
    const io = { get, patch: vi.fn(), upload: vi.fn() };
    expect(() => resolveReleaseTag('v0.2.0', io)).toThrow('directly to a commit');
    get.mockReturnValue({ object: { type: 'commit', sha: 'invalid' } });
    expect(() => resolveReleaseTag('v0.2.0', io)).toThrow();
  });
});
