import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PUBLICATION_POLICY } from './policy.js';
import { REGISTRY_VERIFICATION_POLICY, verifyRegistryPublication } from './registry.js';
import type { RegistryFetch, RegistryResponse } from './registry.js';

const archive = new TextEncoder().encode('checked release archive');
const integrity = 'sha512-' + createHash('sha512').update(archive).digest('base64');
const metadata = {
  name: PUBLICATION_POLICY.name,
  version: '0.1.1',
  peerDependencies: PUBLICATION_POLICY.peers,
};
const tarball = 'https://registry.npmjs.org/@fastsprout/reacd/-/reacd-0.1.1.tgz';
const published = { ...metadata, dist: { integrity, tarball } };

function response(
  status = 200,
  data: unknown = published,
  bytes = archive,
): RegistryResponse {
  return {
    status,
    json: async () => data,
    arrayBuffer: async () => bytes.slice().buffer,
  };
}

function fixture() {
  return {
    fetch: vi.fn<RegistryFetch>(),
    sleep: vi.fn<(delay: number) => Promise<void>>(async () => undefined),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('public registry publication identity', () => {
  it('verifies the separate adapter using its own identity and archive', async () => {
    const adapter = { name: '@fastsprout/reacd-shadcn', version: '0.2.0' } as const;
    const adapterTarball =
      'https://registry.npmjs.org/@fastsprout/reacd-shadcn/-/reacd-shadcn-0.2.0.tgz';
    const io = fixture();
    io.fetch
      .mockResolvedValueOnce(
        response(200, { ...adapter, dist: { integrity, tarball: adapterTarball } }),
      )
      .mockResolvedValueOnce(response());
    await expect(verifyRegistryPublication(adapter, archive, io)).resolves.toEqual({
      ...adapter,
      integrity,
    });
    expect(io.fetch.mock.calls.map(([url]) => url)).toEqual([
      'https://registry.npmjs.org/%40fastsprout%2Freacd-shadcn/0.2.0',
      adapterTarball,
    ]);
  });

  it('rejects a sibling package even when its version and bytes match', async () => {
    const io = fixture();
    io.fetch.mockResolvedValue(
      response(200, { ...published, name: '@fastsprout/reacd-shadcn' }),
    );
    await expect(verifyRegistryPublication(metadata, archive, io)).rejects.toThrow(
      'Public registry did not confirm',
    );
    expect(io.fetch).toHaveBeenCalledTimes(REGISTRY_VERIFICATION_POLICY.attempts);
  });
  it('verifies exact metadata and unauthenticated public archive bytes', async () => {
    const io = fixture();
    io.fetch.mockResolvedValueOnce(response()).mockResolvedValueOnce(response());
    expect(await verifyRegistryPublication(metadata, archive, io)).toEqual({
      name: metadata.name,
      version: metadata.version,
      integrity,
    });
    expect(io.fetch.mock.calls.map(([url]) => url)).toEqual([
      'https://registry.npmjs.org/%40fastsprout%2Freacd/0.1.1',
      tarball,
    ]);
    for (const [, options] of io.fetch.mock.calls) {
      expect(options).toMatchObject({
        credentials: 'omit',
        redirect: 'error',
        cache: 'no-store',
      });
      expect(options.signal).toBeDefined();
    }
    expect(io.fetch.mock.calls[0]?.[1].headers).toEqual({ Accept: 'application/json' });
    expect(io.fetch.mock.calls[1]?.[1].headers).toEqual({
      Accept: 'application/octet-stream',
    });
    expect(io.sleep).not.toHaveBeenCalled();
  });

  it('retries propagation with a named bound and no wait after success', async () => {
    const io = fixture();
    io.fetch
      .mockResolvedValueOnce(response(404))
      .mockResolvedValueOnce(response())
      .mockResolvedValueOnce(response());
    await expect(verifyRegistryPublication(metadata, archive, io)).resolves.toEqual({
      name: metadata.name,
      version: metadata.version,
      integrity,
    });
    expect(io.fetch).toHaveBeenCalledTimes(3);
    expect(io.sleep).toHaveBeenCalledExactlyOnceWith(
      REGISTRY_VERIFICATION_POLICY.delayMs,
    );
  });

  it.each([
    null,
    [],
    { name: metadata.name, version: '0.1.1', staged: true },
    { ...published, name: '@another/package' },
    { ...published, version: '0.1.0' },
    { ...published, dist: { ...published.dist, integrity: 'sha512-invalid' } },
    {
      ...published,
      dist: {
        ...published.dist,
        integrity: 'sha512-' + createHash('sha512').update('other').digest('base64'),
      },
    },
  ])('does not accept placeholders or mismatched metadata: %j', async (input) => {
    const io = fixture();
    io.fetch.mockResolvedValue(response(200, input));
    await expect(verifyRegistryPublication(metadata, archive, io)).rejects.toThrow(
      'Public registry did not confirm',
    );
    expect(io.fetch).toHaveBeenCalledTimes(REGISTRY_VERIFICATION_POLICY.attempts);
    expect(io.sleep).toHaveBeenCalledTimes(REGISTRY_VERIFICATION_POLICY.attempts - 1);
  });

  it.each([
    'invalid URL',
    'https://unrelated.example/package.tgz',
    'http://registry.npmjs.org/package.tgz',
    'https://user:password@registry.npmjs.org/package.tgz',
    'https://:password@registry.npmjs.org/package.tgz',
    `${tarball}?staged=true`,
    `${tarball}#staged`,
  ])('rejects a nonpublic tarball location: %s', async (url) => {
    const io = fixture();
    io.fetch.mockResolvedValue(
      response(200, {
        ...published,
        dist: { integrity, tarball: url },
      }),
    );
    await expect(verifyRegistryPublication(metadata, archive, io)).rejects.toThrow();
    expect(io.fetch).toHaveBeenCalledTimes(REGISTRY_VERIFICATION_POLICY.attempts);
  });

  it.each([404, 403, 500])('never accepts metadata HTTP %s', async (status) => {
    const io = fixture();
    io.fetch.mockResolvedValue(response(status));
    await expect(verifyRegistryPublication(metadata, archive, io)).rejects.toThrow();
    expect(io.fetch).toHaveBeenCalledTimes(REGISTRY_VERIFICATION_POLICY.attempts);
  });

  it.each(['unavailable', 'wrong bytes', 'wrong length'])(
    'rejects a staged archive: %s',
    async (mode) => {
      const io = fixture();
      io.fetch.mockImplementation(async (url) =>
        url === tarball
          ? response(
              mode === 'unavailable' ? 404 : 200,
              published,
              mode === 'wrong length' ? new Uint8Array() : archive.map(() => 0),
            )
          : response(),
      );
      await expect(verifyRegistryPublication(metadata, archive, io)).rejects.toThrow();
      expect(io.fetch).toHaveBeenCalledTimes(REGISTRY_VERIFICATION_POLICY.attempts * 2);
    },
  );

  it('retries JSON and network failures without exposing details', async () => {
    const io = fixture();
    io.fetch
      .mockRejectedValueOnce(new Error('private request details'))
      .mockResolvedValueOnce({
        ...response(),
        json: async () => {
          throw new SyntaxError('private response details');
        },
      })
      .mockResolvedValueOnce(response())
      .mockResolvedValueOnce(response());
    await expect(verifyRegistryPublication(metadata, archive, io)).resolves.toEqual({
      name: metadata.name,
      version: metadata.version,
      integrity,
    });
    expect(io.sleep).toHaveBeenCalledTimes(2);
  });

  it('rejects an empty local archive before any registry read', async () => {
    const io = fixture();
    await expect(
      verifyRegistryPublication(metadata, new Uint8Array(), io),
    ).rejects.toThrow('empty');
    expect(io.fetch).not.toHaveBeenCalled();
  });

  it('uses production IO adapters with fake fetch and timers', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn<RegistryFetch>();
    fetch
      .mockResolvedValueOnce(response(404))
      .mockResolvedValueOnce(response())
      .mockResolvedValueOnce(response());
    vi.stubGlobal('fetch', fetch);
    const result = verifyRegistryPublication(metadata, archive);
    await vi.runAllTimersAsync();
    await expect(result).resolves.toEqual({
      name: metadata.name,
      version: metadata.version,
      integrity,
    });
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

it('looks up exact public version status without parsing or credentials', async () => {
  const { lookupRegistryPublication } = await import('./registry.js');
  const io = fixture();
  io.fetch.mockResolvedValue(response(404));
  expect(await lookupRegistryPublication(metadata, io.fetch)).toBe(404);
  expect(io.fetch).toHaveBeenCalledWith(
    'https://registry.npmjs.org/%40fastsprout%2Freacd/0.1.1',
    expect.objectContaining({
      credentials: 'omit',
      redirect: 'error',
      cache: 'no-store',
    }),
  );
  vi.stubGlobal('fetch', io.fetch);
  expect(await lookupRegistryPublication(metadata)).toBe(404);
});
