import { describe, expect, it, vi } from 'vitest';
import { PUBLICATION_POLICY, SHADCN_PUBLICATION_POLICY } from './policy.js';
import { publishCheckedPackages } from './publish.js';
import type { CheckedPackages, PublicationIO } from './publish.js';

const engine = {
  name: PUBLICATION_POLICY.name,
  version: '0.2.0',
  peerDependencies: PUBLICATION_POLICY.peers,
};
const adapter = {
  name: SHADCN_PUBLICATION_POLICY.name,
  version: '0.2.0',
  peerDependencies: { ...PUBLICATION_POLICY.peers, '@fastsprout/reacd': '0.2.0' },
};
const packages: CheckedPackages = [
  { metadata: engine, archivePath: '/checked/core.tgz', bytes: new Uint8Array([1]) },
  { metadata: adapter, archivePath: '/checked/shadcn.tgz', bytes: new Uint8Array([2]) },
];
function fixture() {
  return {
    lookup: vi.fn<PublicationIO['lookup']>().mockResolvedValue(404),
    upload: vi.fn<PublicationIO['upload']>().mockResolvedValue(undefined),
    verify: vi.fn<PublicationIO['verify']>().mockImplementation(async (metadata) => ({
      name: metadata.name,
      version: metadata.version,
      integrity: 'sha512-checked',
    })),
  };
}

describe('retry-safe two-package publication', () => {
  it('uploads and verifies each missing package before continuing', async () => {
    const io = fixture();
    const events: string[] = [];
    io.upload.mockImplementation(async (path) => {
      events.push(`upload:${path}`);
    });
    io.verify.mockImplementation(async (metadata) => {
      events.push(`verify:${metadata.name}`);
      return { ...metadata, integrity: 'sha512-checked' };
    });
    expect(await publishCheckedPackages(packages, io)).toHaveLength(2);
    expect(events).toEqual([
      'upload:/checked/core.tgz',
      'verify:@fastsprout/reacd',
      'upload:/checked/shadcn.tgz',
      'verify:@fastsprout/reacd-shadcn',
    ]);
  });

  it('resumes partial publication without overwriting immutable engine', async () => {
    const io = fixture();
    io.lookup.mockResolvedValueOnce(200).mockResolvedValueOnce(404);
    expect(await publishCheckedPackages(packages, io)).toHaveLength(2);
    expect(io.upload).toHaveBeenCalledExactlyOnceWith('/checked/shadcn.tgz');
    expect(io.verify.mock.calls).toEqual([
      [engine, packages[0].bytes],
      [adapter, packages[1].bytes],
    ]);
  });

  it('verifies existing archives before skipping uploads', async () => {
    const io = fixture();
    io.lookup.mockResolvedValue(200);
    expect(await publishCheckedPackages(packages, io)).toHaveLength(2);
    expect(io.upload).not.toHaveBeenCalled();
    expect(io.verify).toHaveBeenCalledTimes(2);
  });

  it.each([401, 403, 429, 500, 302])(
    'fails closed on lookup HTTP%s',
    async (status) => {
      const io = fixture();
      io.lookup.mockResolvedValue(status);
      await expect(publishCheckedPackages(packages, io)).rejects.toThrow('lookup');
      expect(io.upload).not.toHaveBeenCalled();
      expect(io.verify).not.toHaveBeenCalled();
    },
  );

  it.each([200, 404])(
    'never advances after unverified HTTP%s package',
    async (status) => {
      const io = fixture();
      io.lookup.mockResolvedValue(status);
      io.verify.mockRejectedValue(new Error('Archive mismatch or staged placeholder.'));
      await expect(publishCheckedPackages(packages, io)).rejects.toThrow('mismatch');
      expect(io.lookup).toHaveBeenCalledTimes(1);
      expect(io.upload).toHaveBeenCalledTimes(status === 404 ? 1 : 0);
    },
  );

  it('propagates lookup and upload failures', async () => {
    const io = fixture();
    io.lookup.mockRejectedValue(new Error('Network failure.'));
    await expect(publishCheckedPackages(packages, io)).rejects.toThrow('Network');
    expect(io.upload).not.toHaveBeenCalled();
    io.lookup.mockResolvedValue(404);
    io.upload.mockRejectedValue(new Error('Upload failed.'));
    await expect(publishCheckedPackages(packages, io)).rejects.toThrow('Upload');
    expect(io.verify).not.toHaveBeenCalled();
  });

  it('preflights both versions and archives before external IO', async () => {
    const io = fixture();
    await expect(
      publishCheckedPackages(
        [packages[0], { ...packages[1], metadata: { ...adapter, version: '0.3.0' } }],
        io,
      ),
    ).rejects.toThrow('versions');
    for (const position of [0, 1]) {
      const first =
        position === 0 ? { ...packages[0], bytes: new Uint8Array() } : packages[0];
      const second =
        position === 1 ? { ...packages[1], bytes: new Uint8Array() } : packages[1];
      await expect(publishCheckedPackages([first, second], io)).rejects.toThrow(
        'empty',
      );
    }
    expect(io.lookup).not.toHaveBeenCalled();
    expect(io.upload).not.toHaveBeenCalled();
  });
});
