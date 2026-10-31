import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  read: vi.fn<(path: URL, encoding?: string) => string | Uint8Array>(),
  stat: vi.fn<() => { isFile: () => boolean }>(),
  metadata: vi.fn(),
  adapterMetadata: vi.fn(),
  verify: vi.fn<
    () => Promise<{
      name: string;
      version: string;
      integrity: string;
    }>
  >(),
  log: vi.fn(),
}));
vi.mock('node:fs', () => ({ readFileSync: mocks.read, lstatSync: mocks.stat }));
vi.mock('../tooling/release/metadata.js', () => ({
  parsePublicationManifest: mocks.metadata,
  parseShadcnPublicationManifest: mocks.adapterMetadata,
}));
vi.mock('../tooling/release/registry.js', () => ({
  verifyRegistryPublication: mocks.verify,
}));
const archive = new Uint8Array([1, 2, 3]);
const metadata = { name: '@fastsprout/reacd', version: '0.1.1' };
const adapterMetadata = { name: '@fastsprout/reacd-shadcn', version: '0.1.1' };

beforeEach(() => {
  vi.resetModules();
  mocks.read.mockReset().mockImplementation((path, encoding) => {
    if (encoding !== 'utf8') return archive;
    const name = path.pathname.endsWith('/packages/shadcn/package.json')
      ? adapterMetadata.name
      : metadata.name;
    return JSON.stringify({ name });
  });
  mocks.stat.mockReset().mockReturnValue({ isFile: () => true });
  mocks.metadata.mockReset().mockReturnValue(metadata);
  mocks.adapterMetadata.mockReset().mockReturnValue(adapterMetadata);
  mocks.verify
    .mockReset()
    .mockResolvedValueOnce({ ...metadata, integrity: 'sha512-verified' })
    .mockResolvedValueOnce({ ...adapterMetadata, integrity: 'sha512-verified' });
  mocks.log.mockReset();
  vi.spyOn(console, 'log').mockImplementation(mocks.log);
});

it('confirms both fixed archives before reporting public success', async () => {
  await import('./release-registry.js');
  expect(mocks.metadata).toHaveBeenCalledExactlyOnceWith({
    name: '@fastsprout/reacd',
  });
  expect(mocks.adapterMetadata).toHaveBeenCalledExactlyOnceWith({
    name: '@fastsprout/reacd-shadcn',
  });
  expect(mocks.verify.mock.calls).toEqual([
    [metadata, archive],
    [adapterMetadata, archive],
  ]);
  expect(mocks.stat).toHaveBeenNthCalledWith(
    1,
    new URL('../.cache/release/package.tgz', import.meta.url),
  );
  expect(mocks.stat).toHaveBeenNthCalledWith(
    2,
    new URL('../.cache/release/shadcn.tgz', import.meta.url),
  );
  expect(mocks.read.mock.calls).toEqual([
    [new URL('../package.json', import.meta.url), 'utf8'],
    [new URL('../.cache/release/package.tgz', import.meta.url)],
    [new URL('../packages/shadcn/package.json', import.meta.url), 'utf8'],
    [new URL('../.cache/release/shadcn.tgz', import.meta.url)],
  ]);
  expect(mocks.log).toHaveBeenNthCalledWith(
    1,
    'Public registry verified: @fastsprout/reacd@0.1.1 (sha512-verified).',
  );
  expect(mocks.log).toHaveBeenNthCalledWith(
    2,
    'Public registry verified: @fastsprout/reacd-shadcn@0.1.1 (sha512-verified).',
  );
});

it('rejects nonregular local archives without consulting the registry', async () => {
  mocks.stat.mockReturnValue({ isFile: () => false });
  await expect(import('./release-registry.js')).rejects.toThrow('regular file');
  expect(mocks.verify).not.toHaveBeenCalled();
  expect(mocks.log).not.toHaveBeenCalled();
});

it('fails when the registry does not confirm publication', async () => {
  mocks.verify.mockReset().mockRejectedValue(new Error('Registry did not confirm.'));
  await expect(import('./release-registry.js')).rejects.toThrow('did not confirm');
  expect(mocks.log).not.toHaveBeenCalled();
});

it('does not report a complete release when only the engine is verified', async () => {
  mocks.verify
    .mockReset()
    .mockResolvedValueOnce({ ...metadata, integrity: 'sha512-verified' })
    .mockRejectedValueOnce(new Error('Adapter publication is pending.'));
  await expect(import('./release-registry.js')).rejects.toThrow('Adapter publication');
  expect(mocks.verify).toHaveBeenCalledTimes(2);
  expect(mocks.log).not.toHaveBeenCalled();
});

it('rejects an invalid adapter manifest before reporting either package', async () => {
  mocks.adapterMetadata.mockImplementation(() => {
    throw new Error('Invalid adapter metadata.');
  });
  await expect(import('./release-registry.js')).rejects.toThrow('Invalid adapter');
  expect(mocks.verify).toHaveBeenCalledTimes(1);
  expect(mocks.log).not.toHaveBeenCalled();
});

it('rejects invalid source metadata before registry access', async () => {
  mocks.read.mockImplementation(() => {
    throw new Error('Missing manifest.');
  });
  await expect(import('./release-registry.js')).rejects.toThrow('Missing manifest');
  vi.resetModules();
  mocks.read.mockReturnValue('invalid JSON');
  await expect(import('./release-registry.js')).rejects.toBeInstanceOf(SyntaxError);
  vi.resetModules();
  mocks.read.mockReturnValue('{}');
  mocks.metadata.mockImplementation(() => {
    throw new Error('Invalid metadata.');
  });
  await expect(import('./release-registry.js')).rejects.toThrow('Invalid metadata');
  expect(mocks.verify).not.toHaveBeenCalled();
  expect(mocks.log).not.toHaveBeenCalled();
});
