import { fileURLToPath } from 'node:url';
import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  append: vi.fn(),
  prepare: vi.fn(),
  read: vi.fn(),
  assets: vi.fn(),
  complete: vi.fn(),
  snapshot: vi.fn(),
  github: vi.fn(),
  identity: vi.fn(),
  recover: vi.fn(),
  log: vi.fn(),
}));
vi.mock('node:fs', () => ({ appendFileSync: mocks.append }));
vi.mock('../tooling/release/candidate.js', () => ({
  prepareReleaseCandidate: mocks.prepare,
  readReleaseCandidate: mocks.read,
}));
vi.mock('../tooling/release/complete.js', () => ({
  verifyCandidateSnapshot: mocks.assets,
  readReleaseSnapshot: mocks.snapshot,
  completeRelease: mocks.complete,
}));
vi.mock('../tooling/release/github-client.js', () => ({
  createReleaseGitHub: mocks.github,
  RELEASE_SOURCE_POLICY: { recoveryDirectory: '.cache/release-source/' },
}));
vi.mock('../tooling/release/verify-environment.js', () => ({
  parseReleaseIdentity: mocks.identity,
}));
vi.mock('../tooling/release/recovery.js', () => ({
  resolveRecoveryRelease: mocks.recover,
}));
const identity = { sha: 'a'.repeat(40), tag: 'v0.2.0', version: '0.2.0', id: 1 };
const io = { get: () => ({}), patch: () => ({}), upload: () => undefined };
const packages: unknown[] = [];
beforeEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.resetAllMocks();
  mocks.identity.mockReturnValue(identity);
  mocks.recover.mockReturnValue(identity);
  mocks.github.mockReturnValue(io);
  mocks.prepare.mockReturnValue(packages);
  mocks.assets.mockReturnValue({ draft: true });
  mocks.read.mockReturnValue(packages);
  mocks.snapshot.mockReturnValue({ checked: true });
  vi.stubEnv('RELEASE_DETAILS', '{"checked":true}');
  mocks.complete.mockResolvedValue(undefined);
  vi.spyOn(console, 'log').mockImplementation(mocks.log);
});
it('writes only validated recovery outputs, not credentials', async () => {
  vi.stubEnv('NPM_PUBLISH_ENABLED', 'true');
  vi.stubEnv('GITHUB_OUTPUT', '/job/output');
  vi.stubEnv('RECOVERY_TAG', 'v0.2.0');
  await import('./release-recover.js');
  expect(mocks.recover).toHaveBeenCalledWith(
    expect.objectContaining({
      tag: 'v0.2.0',
      workflowSha: process.env['GITHUB_SHA'],
    }),
    io,
  );
  expect(mocks.append).toHaveBeenCalledExactlyOnceWith(
    '/job/output',
    'release_created=true\nrelease_id=1\ndetails={"checked":true}\nsha=' +
      identity.sha +
      '\nchecked_sha=' +
      identity.sha +
      '\ntag_name=v0.2.0\nversion=0.2.0\npublish_enabled=true\n',
  );
  expect(mocks.log).toHaveBeenCalledWith('Checked release recovery prepared: v0.2.0.');
});
it('refuses disabled recovery and missing job outputs', async () => {
  vi.stubEnv('NPM_PUBLISH_ENABLED', 'false');
  await expect(import('./release-recover.js')).rejects.toThrow('enabled');
  vi.resetModules();
  vi.stubEnv('NPM_PUBLISH_ENABLED', 'true');
  vi.stubEnv('GITHUB_OUTPUT', '');
  await expect(import('./release-recover.js')).rejects.toThrow('output destination');
  expect(mocks.recover).not.toHaveBeenCalled();
});
it('does not report recovery when source verification fails', async () => {
  vi.stubEnv('NPM_PUBLISH_ENABLED', 'true');
  vi.stubEnv('GITHUB_OUTPUT', '/job/output');
  mocks.recover.mockImplementation(() => {
    throw new Error('Source unverified');
  });
  await expect(import('./release-recover.js')).rejects.toThrow('Source unverified');
  expect(mocks.append).not.toHaveBeenCalled();
  expect(mocks.log).not.toHaveBeenCalled();
});
it.each(['false', 'true'])('prepares the selected source (%s)', async (mode) => {
  vi.stubEnv('RELEASE_RECOVERY', mode);
  await import('./release-candidate.js');
  const root = new URL('../', import.meta.url);
  expect(mocks.prepare).toHaveBeenCalledWith(
    root,
    mode === 'true' ? new URL('.cache/release-source/', root) : root,
    identity,
  );
  expect(mocks.assets).toHaveBeenCalledWith(identity, packages, { checked: true });
  expect(mocks.log).toHaveBeenCalledWith(
    'Release candidate archives verified: v0.2.0.',
  );
});
it('propagates a conflicting archive before reporting candidate success', async () => {
  mocks.assets.mockImplementation(() => {
    throw new Error('Archive conflict');
  });
  await expect(import('./release-candidate.js')).rejects.toThrow('Archive conflict');
  expect(mocks.log).not.toHaveBeenCalled();
});
it('awaits registry and GitHub completion before reporting a release', async () => {
  await import('./release-complete.js');
  expect(mocks.read).toHaveBeenCalledWith(new URL('../', import.meta.url), identity);
  expect(mocks.complete).toHaveBeenCalledWith(identity, packages, io);
  expect(mocks.log).toHaveBeenCalledWith(
    'GitHub and both npm packages are verified: v0.2.0.',
  );
  expect(fileURLToPath(new URL('../', import.meta.url))).toBeTruthy();
});
it('does not report completion after a registry failure', async () => {
  mocks.complete.mockRejectedValue(new Error('Adapter missing'));
  await expect(import('./release-complete.js')).rejects.toThrow('Adapter missing');
  expect(mocks.log).not.toHaveBeenCalled();
});

it('requires validated draft details before checking npm candidate bytes', async () => {
  vi.stubEnv('RELEASE_DETAILS', '');
  await expect(import('./release-candidate.js')).rejects.toThrow('draft details');
  expect(mocks.assets).not.toHaveBeenCalled();
});
it('captures draft metadata only in its preparation job', async () => {
  vi.stubEnv('GITHUB_OUTPUT', '/job/output');
  await import('./release-details.js');
  expect(mocks.snapshot).toHaveBeenCalledWith(identity, io);
  expect(mocks.append).toHaveBeenCalledWith(
    '/job/output',
    'details={"checked":true}\n',
  );
});
it('refuses draft metadata capture without a job output destination', async () => {
  vi.stubEnv('GITHUB_OUTPUT', '');
  await expect(import('./release-details.js')).rejects.toThrow('output destination');
  expect(mocks.append).not.toHaveBeenCalled();
});

it('refuses publication of a candidate that was made public prematurely', async () => {
  mocks.assets.mockReturnValue({ draft: false });
  await expect(import('./release-candidate.js')).rejects.toThrow('private draft');
  expect(mocks.log).not.toHaveBeenCalled();
});
