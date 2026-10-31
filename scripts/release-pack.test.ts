import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fileURLToPath } from 'node:url';

const mocks = vi.hoisted(() => ({
  pack: vi.fn(),
  adapter: vi.fn(),
  material: vi.fn(),
  log: vi.fn(),
}));
vi.mock('../tooling/release/pack.js', () => ({
  packReleaseArchive: mocks.pack,
  packShadcnArchive: mocks.adapter,
  packMuiArchive: mocks.material,
}));
beforeEach(() => {
  vi.resetModules();
  mocks.pack.mockReset().mockReturnValue('/repo/.cache/release/package.tgz');
  mocks.adapter.mockReset().mockReturnValue('/repo/.cache/release/shadcn.tgz');
  mocks.material.mockReset().mockReturnValue('/repo/.cache/release/mui.tgz');
  mocks.log.mockReset();
  vi.spyOn(console, 'log').mockImplementation(mocks.log);
});

describe('release pack CLI', () => {
  it('packs its repository and reports only completed verification', async () => {
    await import('./release-pack.js');
    expect(mocks.pack).toHaveBeenCalledExactlyOnceWith(
      fileURLToPath(new URL('../', import.meta.url)),
    );
    expect(mocks.log).toHaveBeenNthCalledWith(
      1,
      'Verified local release archive: /repo/.cache/release/package.tgz',
    );
    expect(mocks.adapter).toHaveBeenCalledExactlyOnceWith(
      fileURLToPath(new URL('../', import.meta.url)),
    );
    expect(mocks.log).toHaveBeenNthCalledWith(
      2,
      'Verified local shadcn archive: /repo/.cache/release/shadcn.tgz',
    );
  });

  it('propagates failure without claiming success or publishing', async () => {
    mocks.pack.mockImplementation(() => {
      throw new Error('Invalid archive');
    });
    await expect(import('./release-pack.js')).rejects.toThrow('Invalid archive');
    expect(mocks.log).not.toHaveBeenCalled();
  });
});
