import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyReleaseCheckout } from './verify.js';

const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});
function repository() {
  const cwd = mkdtempSync(join(tmpdir(), 'reacd-release-'));
  directories.push(cwd);
  const git = (...args: string[]) => execFileSync('git', args, {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  git('init', '--initial-branch=main');
  git('config', 'user.name', 'Release fixture');
  git('config', 'user.email', 'release@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  git('config', 'tag.gpgsign', 'false');
  git('config', 'core.hooksPath', join(cwd, 'no-hooks'));
  writeFileSync(join(cwd, 'source.txt'), 'first');
  git('add', 'source.txt');
  git('commit', '-m', 'feat: fixture');
  git('tag', '-a', 'v0.1.0', '-m', 'release fixture');
  const sha = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', sha);
  return { cwd, git, sha, tag: 'v0.1.0', version: '0.1.0' };
}

describe('release checkout verification', () => {
  it('accepts exact clean HEAD and annotated tag on main ancestry', () => {
    const fixture = repository();
    expect(() => verifyReleaseCheckout(fixture.cwd, fixture)).not.toThrow();
    fixture.git('tag', '-d', fixture.tag);
    fixture.git('tag', fixture.tag);
    fixture.git('checkout', '--detach', fixture.sha);
    expect(() => verifyReleaseCheckout(fixture.cwd, fixture)).not.toThrow();
  });

  it('rejects modified and untracked source', () => {
    const fixture = repository();
    writeFileSync(join(fixture.cwd, 'source.txt'), 'modified');
    expect(() => verifyReleaseCheckout(fixture.cwd, fixture)).toThrow('clean');
    fixture.git('checkout', '--', 'source.txt');
    writeFileSync(join(fixture.cwd, 'untracked.txt'), 'unexpected');
    expect(() => verifyReleaseCheckout(fixture.cwd, fixture)).toThrow('clean');
  });

  it('rejects absent tag, moved tag, checkout mismatch and detached ancestry', () => {
    const fixture = repository();
    expect(() => verifyReleaseCheckout(fixture.cwd, {
      ...fixture, sha: 'b'.repeat(40),
    })).toThrow('HEAD');
    fixture.git('tag', '-d', fixture.tag);
    expect(() => verifyReleaseCheckout(fixture.cwd, fixture)).toThrow('Git');
    fixture.git('tag', fixture.tag);
    writeFileSync(join(fixture.cwd, 'source.txt'), 'second');
    fixture.git('commit', '-am', 'fix: next');
    const next = fixture.git('rev-parse', 'HEAD');
    expect(() => verifyReleaseCheckout(fixture.cwd, { ...fixture, sha: next }))
      .toThrow('tag');
    fixture.git('tag', '-f', fixture.tag);
    expect(() => verifyReleaseCheckout(fixture.cwd, { ...fixture, sha: next }))
      .toThrow('Git');
  });

  it('uses fixed executable and argument arrays with sanitized failures', () => {
    const execute = vi.fn<() => string>().mockImplementation(() => {
      throw new Error('secret-output');
    });
    expect(() => verifyReleaseCheckout('/checkout', {
      sha: 'a'.repeat(40), tag: 'v1.0.0', version: '1.0.0',
    }, execute)).toThrow('Git prerequisite failed');
    expect(execute).toHaveBeenCalledWith('git', ['rev-parse', '--verify', 'HEAD'], {
      cwd: '/checkout', encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  });
});
