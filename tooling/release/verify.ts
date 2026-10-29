import { execFileSync } from 'node:child_process';
import { PUBLICATION_POLICY } from './policy.js';
import type { ReleaseIdentity } from './verify-environment.js';

type ExecuteGit = (
  executable: string,
  arguments_: string[],
  options: {
    cwd: string;
    encoding: 'utf8';
    stdio: ['ignore', 'pipe', 'pipe'];
  },
) => string;

export function verifyReleaseCheckout(
  cwd: string,
  identity: ReleaseIdentity,
  execute: ExecuteGit = execFileSync,
): void {
  function git(arguments_: string[]): string {
    try {
      return execute('git', arguments_, {
        cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      }).trim();
    } catch {
      throw new Error('Git prerequisite failed during release verification.');
    }
  }
  if (git(['rev-parse', '--verify', 'HEAD']) !== identity.sha) {
    throw new Error('Release verification rejected the checkout HEAD.');
  }
  const target = git([
    'rev-parse', '--verify', `refs/tags/${identity.tag}^{commit}`,
  ]);
  if (target !== identity.sha) {
    throw new Error('Release verification rejected the release tag target.');
  }
  git(['merge-base', '--is-ancestor', identity.sha, PUBLICATION_POLICY.main]);
  if (git(['status', '--porcelain', '--untracked-files=normal']) !== '') {
    throw new Error('Release verification requires a clean source checkout.');
  }
}
