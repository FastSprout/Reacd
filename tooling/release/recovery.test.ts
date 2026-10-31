import { describe, expect, it, vi } from 'vitest';
import { resolveRecoveryRelease } from './recovery.js';
import type { ReleaseGitHub } from './github-client.js';

const sha = 'a'.repeat(40);
const workflowSha = 'b'.repeat(40);
const context = {
  tag: 'v0.2.0',
  workflowSha,
  event: 'workflow_dispatch',
  ref: 'refs/heads/main',
  actions: 'true',
  repository: 'FastSprout/Reacd',
  runner: 'github-hosted',
};
function fixture(annotated = true) {
  const get = vi.fn<ReleaseGitHub['get']>().mockImplementation((path) => {
    if (path.startsWith('git/ref/')) {
      return { object: { type: annotated ? 'tag' : 'commit', sha } };
    }
    if (path.startsWith('git/tags/')) return { object: { type: 'commit', sha } };
    if (path.startsWith('compare/')) return { status: 'ahead' };
    if (path.startsWith('releases?')) {
      return [{ id: 1, tag_name: 'v0.2.0', draft: false }];
    }
    if (path.startsWith('actions/runs?')) {
      const head = path.includes(workflowSha) ? workflowSha : sha;
      return {
        workflow_runs: [
          {
            id: 2,
            head_sha: head,
            path: '.github/workflows/release.yml',
            status: 'completed',
            conclusion: 'success',
          },
        ],
      };
    }
    return { jobs: [{ name: 'check / check', conclusion: 'success' }] };
  });
  return {
    get,
    patch: vi.fn<ReleaseGitHub['patch']>(),
    upload: vi.fn<ReleaseGitHub['upload']>(),
  };
}

describe('main-only recovery of an already checked release', () => {
  it.each([true, false])('verifies both sources before drafting (%s)', (annotated) => {
    const io = fixture(annotated);
    expect(resolveRecoveryRelease(context, io)).toEqual({
      sha,
      tag: 'v0.2.0',
      version: '0.2.0',
      id: 1,
    });
    expect(io.get).toHaveBeenCalledWith(expect.stringContaining(workflowSha));
    expect(io.patch).toHaveBeenCalledExactlyOnceWith('releases/1', { draft: true });
  });
  it.each([
    { tag: 'v0.2.0; injected' },
    { tag: 'v00.2.0' },
    { actions: 'false' },
    { repository: 'other/repo' },
    { runner: 'self-hosted' },
    { workflowSha: 'main' },
    { event: 'push' },
    { ref: 'refs/heads/feature' },
  ])('rejects invalid context before API mutation: %j', (change) => {
    const io = fixture();
    expect(() => resolveRecoveryRelease({ ...context, ...change }, io)).toThrow();
    expect(io.patch).not.toHaveBeenCalled();
  });
  it('refuses an unverified tag even when workflow code passed', () => {
    const io = fixture();
    const original = io.get.getMockImplementation();
    io.get.mockImplementation((path) =>
      path.startsWith('actions/runs?') && !path.includes(workflowSha)
        ? { workflow_runs: [] }
        : original?.(path),
    );
    expect(() => resolveRecoveryRelease(context, io)).toThrow('complete Check');
    expect(io.patch).not.toHaveBeenCalled();
  });
  it('refuses a tag outside the checked main history', () => {
    const io = fixture();
    const original = io.get.getMockImplementation();
    io.get.mockImplementation((path) =>
      path.startsWith('compare/') ? { status: 'diverged' } : original?.(path),
    );
    expect(() => resolveRecoveryRelease(context, io)).toThrow('main history');
    expect(io.patch).not.toHaveBeenCalled();
  });
  it('refuses a completed workflow without a successful full Check job', () => {
    const io = fixture();
    const original = io.get.getMockImplementation();
    io.get.mockImplementation((path) =>
      path.endsWith('/jobs?per_page=100')
        ? { jobs: [{ name: 'check / check', conclusion: 'failure' }] }
        : original?.(path),
    );
    expect(() => resolveRecoveryRelease(context, io)).toThrow('complete Check');
    expect(io.patch).not.toHaveBeenCalled();
  });
});

it('accepts already private candidates without changing their draft', () => {
  const io = fixture();
  const original = io.get.getMockImplementation();
  io.get.mockImplementation((path) =>
    path.startsWith('releases?')
      ? [{ id: 1, tag_name: context.tag, draft: true }]
      : original?.(path),
  );
  expect(resolveRecoveryRelease(context, io).sha).toBe(sha);
  expect(io.patch).not.toHaveBeenCalled();
});
it('rejects a response for a different tag', () => {
  const io = fixture();
  const original = io.get.getMockImplementation();
  io.get.mockImplementation((path) =>
    path.startsWith('releases?')
      ? [{ id: 1, tag_name: 'v0.1.0', draft: true }]
      : original?.(path),
  );
  expect(() => resolveRecoveryRelease(context, io)).toThrow('tag identity');
});
it('ignores unrelated, unfinished and unsuccessful check records', () => {
  const io = fixture();
  const original = io.get.getMockImplementation();
  io.get.mockImplementation((path) => {
    if (path.startsWith('actions/runs?')) {
      return {
        workflow_runs: [
          {
            id: 1,
            head_sha: 'c'.repeat(40),
            path: '.github/workflows/release.yml',
            status: 'completed',
            conclusion: 'success',
          },
          {
            id: 2,
            head_sha: sha,
            path: 'different.yml',
            status: 'completed',
            conclusion: 'success',
          },
          {
            id: 3,
            head_sha: sha,
            path: '.github/workflows/release.yml',
            status: 'in_progress',
            conclusion: null,
          },
          {
            id: 4,
            head_sha: sha,
            path: '.github/workflows/release.yml',
            status: 'completed',
            conclusion: 'failure',
          },
        ],
      };
    }
    if (path.includes('/4/jobs'))
      return {
        jobs: [
          { name: 'different', conclusion: 'success' },
          { name: 'check / check', conclusion: 'failure' },
        ],
      };
    return original?.(path);
  });
  expect(() => resolveRecoveryRelease(context, io)).toThrow('complete Check');
  expect(io.patch).not.toHaveBeenCalled();
});
