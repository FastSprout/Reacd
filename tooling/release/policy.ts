import { valid } from 'semver';

export const PUBLICATION_POLICY = {
  name: '@fastsprout/reacd',
  archiveBasename: 'fastsprout-reacd',
  repository: 'git+https://github.com/FastSprout/Reacd.git',
  githubRepository: 'FastSprout/Reacd',
  homepage: 'https://reacd.dev/',
  issues: 'https://github.com/FastSprout/Reacd/issues',
  registry: 'https://registry.npmjs.org/',
  node: '>=26.0.0',
  minimumNodeVersion: '26.0.0',
  minimumNpmVersion: '11.5.1',
  main: 'refs/remotes/origin/main',
  peers: { react: '19.3.1', 'react-dom': '19.3.1', jotai: '3.0.1' },
} as const;

export function isReleaseVersion(input: unknown): input is string {
  return typeof input === 'string' && /^\d/.test(input) &&
    input.trim() === input && valid(input) !== null;
}
