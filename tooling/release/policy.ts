import { gte, valid } from 'semver';

export const PUBLICATION_POLICY = {
  name: '@fastsprout/reacd',
  archiveBasename: 'fastsprout-reacd',
  output: '.cache/release/package.tgz',
  packagePath: '.',
  files: [
    'dist',
    'schema/reacd.schema.json',
    'schema/generative.schema.json',
    'README.md',
    'LICENSE',
  ],
  exportKeys: [
    '.',
    './schema.json',
    './generative-schema.json',
    './generative',
    './jsx-runtime',
    './jsx-dev-runtime',
    './bootstrap',
    './adapter-runtime/core/*.js',
    './adapter-runtime/schema/*.js',
    './adapter-runtime/components/*.js',
    './adapter-runtime/renderer/*.js',
  ],
  repository: 'git+https://github.com/FastSprout/Reacd.git',
  githubRepository: 'FastSprout/Reacd',
  homepage: 'https://reacd.dev/',
  issues: 'https://github.com/FastSprout/Reacd/issues',
  registry: 'https://registry.npmjs.org/',
  node: '>=22.12.0',
  minimumNodeVersion: '22.12.0',
  minimumNpmVersion: '11.5.1',
  main: 'refs/remotes/origin/main',
  peers: { react: '19.3.1', 'react-dom': '19.3.1', jotai: '3.0.1' },
} as const;

export const SHADCN_PUBLICATION_POLICY = {
  ...PUBLICATION_POLICY,
  name: '@fastsprout/reacd-shadcn',
  archiveBasename: 'fastsprout-reacd-shadcn',
  output: '.cache/release/shadcn.tgz',
  packagePath: 'packages/shadcn',
  files: ['dist', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md'],
  exportKeys: ['.', './styles', './styles.css'],
  peers: PUBLICATION_POLICY.peers,
  corePeer: PUBLICATION_POLICY.name,
} as const;

export const MUI_PUBLICATION_POLICY = {
  ...SHADCN_PUBLICATION_POLICY,
  name: '@fastsprout/reacd-mui',
  archiveBasename: 'fastsprout-reacd-mui',
  output: '.cache/release/mui.tgz',
  packagePath: 'packages/mui',
  files: ['dist', 'README.md', 'LICENSE'],
  firstVersion: '0.3.0',
} as const;

export type PublicationPolicy =
  | typeof PUBLICATION_POLICY
  | typeof SHADCN_PUBLICATION_POLICY
  | typeof MUI_PUBLICATION_POLICY;

export function requiresMaterialPackage(version: string): boolean {
  return gte(version, MUI_PUBLICATION_POLICY.firstVersion + '-0');
}

export function isReleaseVersion(input: unknown): input is string {
  return (
    typeof input === 'string' &&
    /^\d/.test(input) &&
    input.trim() === input &&
    valid(input) !== null
  );
}
