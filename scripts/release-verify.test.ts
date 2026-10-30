import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fileURLToPath } from 'node:url';

const mocks = vi.hoisted(() => ({
  read: vi.fn<() => string>(),
  metadata: vi.fn(),
  environment: vi.fn(),
  checkout: vi.fn(),
  runtime: vi.fn(),
  log: vi.fn(),
}));
vi.mock('node:fs', () => ({ readFileSync: mocks.read }));
vi.mock('../tooling/release/metadata.js', () => ({
  parsePublicationManifest: mocks.metadata,
}));
vi.mock('../tooling/release/verify-environment.js', () => ({
  parseReleaseEnvironment: mocks.environment,
}));
vi.mock('../tooling/release/verify-runtime.js', () => ({
  verifyPublicationRuntime: mocks.runtime,
}));
vi.mock('../tooling/release/verify.js', () => ({
  verifyReleaseCheckout: mocks.checkout,
}));
beforeEach(() => {
  vi.resetModules();
  mocks.read.mockReset().mockReturnValue('{"name":"@fastsprout/reacd"}');
  mocks.metadata.mockReset().mockReturnValue({
    name: '@fastsprout/reacd', version: '0.1.0',
  });
  mocks.environment.mockReset().mockReturnValue({
    sha: 'a'.repeat(40), tag: 'v0.1.0', version: '0.1.0',
  });
  mocks.checkout.mockReset();
  mocks.runtime.mockReset();
  mocks.log.mockReset();
  vi.spyOn(console, 'log').mockImplementation(mocks.log);
});

describe('release verifier entry point', () => {
  it('validates identity before reporting checkout success', async () => {
    await import('./release-verify.js');
    expect(mocks.metadata).toHaveBeenCalledExactlyOnceWith({
      name: '@fastsprout/reacd',
    });
    expect(mocks.environment).toHaveBeenCalledExactlyOnceWith(process.env);
    expect(mocks.runtime).toHaveBeenCalledExactlyOnceWith();
    expect(mocks.checkout).toHaveBeenCalledExactlyOnceWith(
      fileURLToPath(new URL('../', import.meta.url)),
      { sha: 'a'.repeat(40), tag: 'v0.1.0', version: '0.1.0' },
    );
    expect(mocks.log).toHaveBeenCalledExactlyOnceWith(
      'Release identity verified: @fastsprout/reacd@0.1.0 (v0.1.0).',
      'OIDC prerequisites present; npm authorization is not verified.',
    );
  });

  it('rejects inconsistent manifest version before consulting git', async () => {
    mocks.metadata.mockReturnValue({ name: '@fastsprout/reacd', version: '0.2.0' });
    await expect(import('./release-verify.js')).rejects.toThrow('version');
    expect(mocks.checkout).not.toHaveBeenCalled();
    expect(mocks.log).not.toHaveBeenCalled();
  });

  it('refuses an incompatible publication runtime before consulting git', async () => {
    mocks.runtime.mockImplementation(() => { throw new Error('Runtime'); });
    await expect(import('./release-verify.js')).rejects.toThrow('Runtime');
    expect(mocks.checkout).not.toHaveBeenCalled();
    expect(mocks.log).not.toHaveBeenCalled();
  });

  it('propagates missing/invalid manifest and prerequisite failures', async () => {
    mocks.read.mockImplementation(() => { throw new Error('Missing manifest'); });
    await expect(import('./release-verify.js')).rejects.toThrow('Missing manifest');
    vi.resetModules();
    mocks.read.mockReturnValue('invalid');
    await expect(import('./release-verify.js')).rejects.toBeInstanceOf(SyntaxError);
    vi.resetModules();
    mocks.read.mockReturnValue('{}');
    mocks.metadata.mockImplementation(() => { throw new Error('Metadata'); });
    await expect(import('./release-verify.js')).rejects.toThrow('Metadata');
    vi.resetModules();
    mocks.metadata.mockReturnValue({ name: '@fastsprout/reacd', version: '0.1.0' });
    mocks.environment.mockImplementation(() => { throw new Error('Identity'); });
    await expect(import('./release-verify.js')).rejects.toThrow('Identity');
    vi.resetModules();
    mocks.environment.mockReturnValue({ version: '0.1.0' });
    mocks.checkout.mockImplementation(() => { throw new Error('Checkout'); });
    await expect(import('./release-verify.js')).rejects.toThrow('Checkout');
    expect(mocks.log).not.toHaveBeenCalled();
  });
});
