import { fileURLToPath } from 'node:url';
import { beforeEach, expect, it, vi } from 'vitest';
import type { PublicationIO } from '../tooling/release/publish.js';

const mocks = vi.hoisted(() => ({
  read: vi.fn<(path: URL, encoding?: string) => string | Uint8Array>(),
  stat: vi.fn<() => { isFile: () => boolean }>(),
  engine: vi.fn(),
  adapter: vi.fn(),
  publish: vi.fn(),
  lookup: vi.fn(),
  verify: vi.fn(),
  exec: vi.fn(),
  log: vi.fn(),
}));
vi.mock('node:fs', () => ({ readFileSync: mocks.read, lstatSync: mocks.stat }));
vi.mock('node:child_process', () => ({ execFileSync: mocks.exec }));
vi.mock('../tooling/release/metadata.js', () => ({
  parsePublicationManifest: mocks.engine,
  parseShadcnPublicationManifest: mocks.adapter,
}));
vi.mock('../tooling/release/publish.js', () => ({
  publishCheckedPackages: mocks.publish,
}));
vi.mock('../tooling/release/registry.js', () => ({
  lookupRegistryPublication: mocks.lookup,
  verifyRegistryPublication: mocks.verify,
}));
const bytes = new Uint8Array([1, 2]);
const engine = { name: '@fastsprout/reacd', version: '0.2.0' };
const adapter = { name: '@fastsprout/reacd-shadcn', version: '0.2.0' };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.read.mockImplementation((_path, encoding) => (encoding ? '{}' : bytes));
  mocks.stat.mockReturnValue({ isFile: () => true });
  mocks.engine.mockReturnValue(engine);
  mocks.adapter.mockReturnValue(adapter);
  mocks.publish.mockImplementation(async (_packages: unknown, io: PublicationIO) => {
    await io.upload('/checked/path.tgz');
    return [engine, adapter];
  });
  vi.spyOn(console, 'log').mockImplementation(mocks.log);
});

it('reads both fixed checked packages and invokes npm without a shell', async () => {
  await import('./release-publish.js');
  expect(mocks.exec).toHaveBeenCalledExactlyOnceWith(
    'npm',
    ['publish', '/checked/path.tgz', '--access', 'public'],
    { stdio: 'inherit' },
  );
  expect(mocks.publish).toHaveBeenCalledWith(
    [
      {
        metadata: engine,
        bytes,
        archivePath: fileURLToPath(
          new URL('../.cache/release/package.tgz', import.meta.url),
        ),
      },
      {
        metadata: adapter,
        bytes,
        archivePath: fileURLToPath(
          new URL('../.cache/release/shadcn.tgz', import.meta.url),
        ),
      },
    ],
    expect.objectContaining({ lookup: mocks.lookup, verify: mocks.verify }),
  );
  expect(mocks.engine).toHaveBeenCalledExactlyOnceWith({});
  expect(mocks.adapter).toHaveBeenCalledExactlyOnceWith({});
  expect(mocks.log).toHaveBeenCalledExactlyOnceWith(
    'Both checked packages are publicly verified.',
  );
});

it('fails before upload when either checked archive is not regular', async () => {
  mocks.stat
    .mockReturnValueOnce({ isFile: () => true })
    .mockReturnValueOnce({ isFile: () => false });
  await expect(import('./release-publish.js')).rejects.toThrow('regular file');
  expect(mocks.publish).not.toHaveBeenCalled();
});

it('never reports success after manifest or publication failure', async () => {
  mocks.adapter.mockImplementationOnce(() => {
    throw new Error('Invalid manifest.');
  });
  await expect(import('./release-publish.js')).rejects.toThrow('Invalid manifest');
  expect(mocks.publish).not.toHaveBeenCalled();
  vi.resetModules();
  mocks.publish.mockRejectedValue(new Error('Unverified package.'));
  await expect(import('./release-publish.js')).rejects.toThrow('Unverified package');
  expect(mocks.log).not.toHaveBeenCalled();
});
