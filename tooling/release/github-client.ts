import { execFileSync } from 'node:child_process';
import { z } from 'zod';
import { PUBLICATION_POLICY } from './policy.js';

export interface ReleaseGitHub {
  readonly get: (path: string) => unknown;
  readonly patch: (path: string, body: Record<string, string | boolean>) => unknown;
  readonly upload: (tag: string, path: string) => void;
}
export const RELEASE_SOURCE_POLICY = {
  recoveryDirectory: '.cache/release-source/',
  artifactDirectory: '.cache/release-candidate/',
  workflow: '.github/workflows/release.yml',
  checkJob: 'check / check',
  pageSize: 100,
} as const;
export const releaseShaSchema = z.string().regex(/^[a-f0-9]{40}$/);
const referenceSchema = z.object({
  object: z.object({ type: z.enum(['commit', 'tag']), sha: releaseShaSchema }),
});

export function resolveReleaseTag(tag: string, github: ReleaseGitHub): string {
  const reference = referenceSchema.parse(
    github.get(`git/ref/tags/${encodeURIComponent(tag)}`),
  );
  if (reference.object.type === 'commit') return reference.object.sha;
  const target = referenceSchema.parse(github.get(`git/tags/${reference.object.sha}`));
  if (target.object.type !== 'commit') {
    throw new Error('Release tag must resolve directly to a commit.');
  }
  return target.object.sha;
}

export function createReleaseGitHub(): ReleaseGitHub {
  function request(
    method: string,
    path: string,
    body?: Record<string, string | boolean>,
  ): unknown {
    let response: string;
    try {
      response = execFileSync(
        'gh',
        [
          'api',
          '--method',
          method,
          `repos/${PUBLICATION_POLICY.githubRepository}/${path}`,
          ...(body ? ['--input', '-'] : []),
        ],
        {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
          ...(body ? { input: JSON.stringify(body) } : {}),
        },
      );
    } catch {
      throw new Error('GitHub release request failed.');
    }
    try {
      const input: unknown = JSON.parse(response);
      return input;
    } catch {
      throw new Error('GitHub release response is invalid.');
    }
  }
  return {
    get: (path) => request('GET', path),
    patch: (path, body) => request('PATCH', path, body),
    upload(tag, path) {
      try {
        execFileSync(
          'gh',
          [
            'release',
            'upload',
            tag,
            path,
            '--repo',
            PUBLICATION_POLICY.githubRepository,
          ],
          { stdio: ['ignore', 'pipe', 'pipe'] },
        );
      } catch {
        throw new Error('GitHub release asset upload failed.');
      }
    },
  };
}
