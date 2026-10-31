import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { completeRelease, verifyCandidateAssets } from './complete.js';
import type { ReleaseGitHub } from './github-client.js';
import type { CheckedPackages, PublicationIO } from './publish.js';
import { PUBLICATION_POLICY as P, SHADCN_PUBLICATION_POLICY as S } from './policy.js';

const identity = { sha: 'a'.repeat(40), tag: 'v0.2.0', version: '0.2.0' };
const packages: CheckedPackages = [
  {
    metadata: { name: P.name, version: '0.2.0', peerDependencies: P.peers },
    archivePath: '/release/fastsprout-reacd-0.2.0.tgz',
    bytes: new Uint8Array([1]),
  },
  {
    metadata: {
      name: S.name,
      version: '0.2.0',
      peerDependencies: { ...P.peers, [P.name]: '0.2.0' },
    },
    archivePath: '/release/fastsprout-reacd-shadcn-0.2.0.tgz',
    bytes: new Uint8Array([2]),
  },
];
function fixture() {
  const assets: { name: string; digest: string }[] = [];
  const events: string[] = [];
  const get = vi.fn<ReleaseGitHub['get']>().mockImplementation((path) => {
    if (path.startsWith('git/ref/')) {
      return { object: { type: 'commit', sha: identity.sha } };
    }
    return { id: 1, tag_name: identity.tag, draft: true, body: 'Changes.', assets };
  });
  const io = {
    get,
    patch: vi.fn<ReleaseGitHub['patch']>(),
    upload: vi.fn<ReleaseGitHub['upload']>().mockImplementation((_tag, path) => {
      const publication = packages.find((p) => p.archivePath === path);
      if (!publication) throw new Error('Unexpected path');
      assets.push({
        name: path.split('/').at(-1) ?? '',
        digest:
          'sha256:' + createHash('sha256').update(publication.bytes).digest('hex'),
      });
      events.push('upload');
    }),
  };
  const verify = vi.fn<PublicationIO['verify']>().mockImplementation(async (meta) => {
    events.push(meta.name);
    return { ...meta, integrity: 'sha512-checked' };
  });
  io.patch.mockImplementation(() => {
    events.push('public');
    return {};
  });
  return { io, verify, events, assets };
}

describe('one completed release across npm and GitHub', () => {
  it('confirms both npm versions before making the GitHub draft public', async () => {
    const f = fixture();
    await completeRelease(identity, packages, f.io, f.verify);
    expect(f.events).toEqual([P.name, S.name, 'upload', 'upload', 'public']);
    expect(f.io.patch).toHaveBeenCalledWith(
      'releases/1',
      expect.objectContaining({ draft: false, make_latest: 'true' }),
    );
  });
  it('never completes GitHub when the adapter publication fails', async () => {
    const f = fixture();
    f.verify
      .mockResolvedValueOnce({ ...packages[0].metadata, integrity: 'checked' })
      .mockRejectedValueOnce(new Error('Adapter missing'));
    await expect(completeRelease(identity, packages, f.io, f.verify)).rejects.toThrow(
      'Adapter missing',
    );
    expect(f.io.patch).not.toHaveBeenCalled();
    expect(f.io.upload).not.toHaveBeenCalled();
  });
  it('rejects an existing conflicting asset before npm or GitHub upload', () => {
    const f = fixture();
    f.assets.push({ name: 'fastsprout-reacd-0.2.0.tgz', digest: 'sha256:wrong' });
    expect(() => verifyCandidateAssets(identity, packages, f.io)).toThrow('archive');
    expect(f.io.patch).not.toHaveBeenCalled();
  });
  it('reuses existing matching GitHub assets on a retry', async () => {
    const f = fixture();
    for (const p of packages) f.io.upload(identity.tag, p.archivePath);
    f.io.upload.mockClear();
    await completeRelease(identity, packages, f.io, f.verify);
    expect(f.io.upload).not.toHaveBeenCalled();
  });
});

it('rejects package version and tag identity mismatches', () => {
  const f = fixture();
  const changed: CheckedPackages = [
    { ...packages[0], metadata: { ...packages[0].metadata, version: '0.1.0' } },
    packages[1],
  ];
  expect(() => verifyCandidateAssets(identity, changed, f.io)).toThrow('versions');
  const original = f.io.get.getMockImplementation();
  f.io.get.mockImplementation((path) =>
    path.startsWith('git/ref/')
      ? { object: { type: 'commit', sha: 'b'.repeat(40) } }
      : original?.(path),
  );
  expect(() => verifyCandidateAssets(identity, packages, f.io)).toThrow('tag identity');
  f.io.get.mockImplementation((path) =>
    path.startsWith('git/ref/')
      ? { object: { type: 'commit', sha: identity.sha } }
      : { id: 1, tag_name: 'v0.1.0', draft: true, body: null, assets: [] },
  );
  expect(() => verifyCandidateAssets(identity, packages, f.io)).toThrow('tag identity');
});
it('handles draft IDs and empty release notes without publishing early', async () => {
  const f = fixture();
  const original = f.io.get.getMockImplementation();
  f.io.get.mockImplementation((path) =>
    path.startsWith('git/ref/')
      ? original?.(path)
      : { id: 1, tag_name: identity.tag, draft: true, body: null, assets: f.assets },
  );
  await completeRelease({ ...identity, releaseId: 1 }, packages, f.io, f.verify);
  expect(f.io.get).toHaveBeenCalledWith('releases/1');
  expect(f.io.patch).toHaveBeenCalledWith('releases/1', {
    draft: false,
    make_latest: 'true',
    body: '',
  });
});
it('does not complete a release when asset upload was not confirmed', async () => {
  const f = fixture();
  f.io.upload.mockImplementation(() => undefined);
  await expect(completeRelease(identity, packages, f.io, f.verify)).rejects.toThrow(
    'archives are not confirmed',
  );
  expect(f.io.patch).not.toHaveBeenCalled();
});

it('rejects a snapshot for a different draft ID', () => {
  const f = fixture();
  expect(() =>
    verifyCandidateAssets({ ...identity, releaseId: 2 }, packages, f.io),
  ).toThrow('tag identity');
});
