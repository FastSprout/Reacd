import { completeRelease } from './complete.js';
import type { ReleaseGitHub } from './github-client.js';
import { readFileSync } from 'node:fs';
import { expect, it, vi } from 'vitest';
import { parseMuiPublicationManifest } from './metadata.js';
import {
  createMuiDistributionManifest,
  parseMuiDistributionManifest,
} from './distribution.js';
import { publishCheckedPackages } from './publish.js';
import type { PublicationIO } from './publish.js';
import { PUBLICATION_POLICY } from './policy.js';

it('strips tooling from the independently versioned Material package', () => {
  const input: unknown = JSON.parse(readFileSync('packages/mui/package.json', 'utf8'));
  const metadata = parseMuiPublicationManifest(input);
  expect(metadata.name).toBe('@fastsprout/reacd-mui');
  const manifest = createMuiDistributionManifest(input);
  expect(parseMuiDistributionManifest(manifest)).toEqual(manifest);
  expect(manifest).not.toHaveProperty('devDependencies');
  expect(manifest).not.toHaveProperty('scripts');
  expect(manifest.dependencies['@mui/material']).toBe('9.5.0');
  expect(manifest.dependencies['@fastsprout/reacd-shadcn']).toBeUndefined();
});

function fixture() {
  const version = '0.3.0';
  const core = {
    name: '@fastsprout/reacd',
    version,
    peerDependencies: PUBLICATION_POLICY.peers,
  } as const;
  const peers = { ...core.peerDependencies, '@fastsprout/reacd': version };
  const packages = [
    { metadata: core, archivePath: 'engine.tgz', bytes: new Uint8Array([1]) },
    {
      metadata: { name: '@fastsprout/reacd-shadcn', version, peerDependencies: peers },
      archivePath: 'shadcn.tgz',
      bytes: new Uint8Array([2]),
    },
    {
      metadata: { name: '@fastsprout/reacd-mui', version, peerDependencies: peers },
      archivePath: 'mui.tgz',
      bytes: new Uint8Array([3]),
    },
  ] as const;
  const io = {
    lookup: vi.fn<PublicationIO['lookup']>().mockResolvedValue(404),
    upload: vi.fn<PublicationIO['upload']>(),
    verify: vi.fn<PublicationIO['verify']>().mockImplementation(async (metadata) => ({
      ...metadata,
      integrity: 'sha512-checked',
    })),
  };
  return { packages, io };
}

it('requires MUI for 0.3.0 before any publication IO', async () => {
  const { packages, io } = fixture();
  await expect(publishCheckedPackages([packages[0], packages[1]], io)).rejects.toThrow(
    'Material',
  );
  expect(io.lookup).not.toHaveBeenCalled();
});

it('verifies all three packages and resumes partial publication', async () => {
  const { packages, io } = fixture();
  io.lookup.mockResolvedValueOnce(200).mockResolvedValueOnce(200);
  expect(await publishCheckedPackages(packages, io)).toHaveLength(3);
  expect(io.upload).toHaveBeenCalledExactlyOnceWith('mui.tgz');
  expect(io.verify.mock.calls).toEqual(
    packages.map((item) => [item.metadata, item.bytes]),
  );
});

it('rejects a divergent Material version before external IO', async () => {
  const { packages, io } = fixture();
  await expect(
    publishCheckedPackages(
      [
        packages[0],
        packages[1],
        { ...packages[2], metadata: { ...packages[2].metadata, version: '0.4.0' } },
      ],
      io,
    ),
  ).rejects.toThrow('versions');
  expect(io.lookup).not.toHaveBeenCalled();
});

it('keeps GitHub private when the third npm package is unverified', async () => {
  const { packages, io } = fixture();
  const sha = 'a'.repeat(40);
  const identity = { sha, tag: 'v0.3.0', version: '0.3.0' };
  const github = {
    get: vi
      .fn<ReleaseGitHub['get']>()
      .mockImplementation((path) =>
        path.startsWith('git/ref/')
          ? { object: { type: 'commit', sha } }
          : { id: 1, tag_name: identity.tag, draft: true, body: 'Changes', assets: [] },
      ),
    patch: vi.fn<ReleaseGitHub['patch']>(),
    upload: vi.fn<ReleaseGitHub['upload']>(),
  };
  io.verify.mockImplementation(async (metadata) => {
    if (metadata.name === '@fastsprout/reacd-mui') throw new Error('Material pending');
    return { ...metadata, integrity: 'sha512-checked' };
  });
  await expect(completeRelease(identity, packages, github, io.verify)).rejects.toThrow(
    'Material pending',
  );
  expect(io.verify).toHaveBeenCalledTimes(3);
  expect(github.upload).not.toHaveBeenCalled();
  expect(github.patch).not.toHaveBeenCalled();
});
