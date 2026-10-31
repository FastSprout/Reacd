import { describe, expect, it } from 'vitest';
import {
  PUBLICATION_POLICY,
  MUI_PUBLICATION_POLICY,
  SHADCN_PUBLICATION_POLICY,
} from './policy.js';
import {
  RELEASE_ARCHIVE_POLICY,
  MUI_ARCHIVE_POLICY,
  SHADCN_ARCHIVE_POLICY,
  validateReleaseArchive,
} from './archive.js';

const meta = {
  name: PUBLICATION_POLICY.name,
  version: '0.1.0',
  peerDependencies: PUBLICATION_POLICY.peers,
};
function archive() {
  const files: { path: string }[] = RELEASE_ARCHIVE_POLICY.required.map((path) => ({
    path,
  }));
  return {
    name: '@fastsprout/reacd',
    version: '0.1.0',
    filename: 'fastsprout-reacd-0.1.0.tgz',
    integrity: 'sha512-dGVzdA==',
    files,
  };
}

describe('release tarball identity and allowlist', () => {
  it('retains required exports and permits ordinary compiled modules', () => {
    const value = archive();
    value.files.push({ path: 'dist/core/policy.js' });
    value.files.push({
      path: 'dist/renderer/accordion/accordion.renderer.d.ts',
    });
    value.files.push({ path: 'dist/schema/grid/grid.schema.js' });
    expect(validateReleaseArchive([value], meta)).toEqual(value);
  });
  it.each([undefined, {}, [], [null], [archive(), archive()]])(
    'rejects malformed pack output %s',
    (value) => {
      expect(() => validateReleaseArchive(value, meta)).toThrow();
    },
  );
  it.each([
    { name: 'different' },
    { version: '0.2.0' },
    { filename: '../fastsprout-reacd-0.1.0.tgz' },
    { filename: '@fastsprout/reacd-0.1.0.tgz' },
    { filename: 'reacd-0.1.0.tgz' },
    { integrity: 'unverified' },
  ])('rejects inconsistent archive metadata %s', (change) => {
    expect(() => validateReleaseArchive([{ ...archive(), ...change }], meta)).toThrow();
  });
  it.each(RELEASE_ARCHIVE_POLICY.required)('requires %s', (missing) => {
    const value = archive();
    value.files = value.files.filter((file) => file.path !== missing);
    expect(() => validateReleaseArchive([value], meta)).toThrow(missing);
  });
  it.each([
    '.env',
    '.npmrc',
    'specs/internal.md',
    'fixtures/secret.ts',
    'dist/__tests__/private.js',
    'dist/example.test.js',
    'dist/entry.js.map',
    'dist/../outside.js',
    'dist/.hidden.js',
    'dist/test-support/private.js',
    'dist/adapter/shadcn/hidden.js',
    'dist/hidden.css',
  ])('rejects unshippable or unsafe path %s', (path) => {
    const value = archive();
    value.files.push({ path });
    expect(() => validateReleaseArchive([value], meta)).toThrow(path);
  });
  it('rejects duplicate archive paths', () => {
    const value = archive();
    value.files.push({ path: 'LICENSE' });
    expect(() => validateReleaseArchive([value], meta)).toThrow('duplicate');
  });
});

it.each([
  [MUI_PUBLICATION_POLICY, MUI_ARCHIVE_POLICY, 'dist/shadcn/control.js'],
  [SHADCN_PUBLICATION_POLICY, SHADCN_ARCHIVE_POLICY, 'dist/mui/control.js'],
] as const)('rejects an opposite concrete adapter inside %s', (policy, files, path) => {
  const input = {
    name: policy.name,
    version: '0.3.0',
    filename: `${policy.archiveBasename}-0.3.0.tgz`,
    integrity: 'sha512-dGVzdA==',
    files: [...files.required.map((file) => ({ path: file })), { path }],
  };
  expect(() =>
    validateReleaseArchive([input], { name: policy.name, version: '0.3.0' }),
  ).toThrow('Cross-package');
});
