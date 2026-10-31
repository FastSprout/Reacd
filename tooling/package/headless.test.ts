import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { verifyHeadlessInstall } from './headless.js';

const { execute } = vi.hoisted(() => ({ execute: vi.fn<() => void>() }));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
let parent: string;
beforeEach(() => {
  parent = mkdtempSync(join(tmpdir(), 'reacd-headless-test-'));
  execute.mockReset();
});
afterEach(() => rmSync(parent, { recursive: true, force: true }));
it('installs only the engine without repository dependency symlinks', () => {
  verifyHeadlessInstall(process.cwd(), '/checked/package.tgz', parent);
  const input: unknown = JSON.parse(
    readFileSync(join(parent, 'headless-consumer/package.json'), 'utf8'),
  );
  expect(input).toEqual({
    private: true,
    type: 'module',
    dependencies: { '@fastsprout/reacd': 'file:///checked/package.tgz' },
  });
  expect(execute).toHaveBeenCalledTimes(2);
  expect(execute).toHaveBeenLastCalledWith(process.execPath, ['headless.mjs'], {
    cwd: join(parent, 'headless-consumer'),
    stdio: 'inherit',
  });
});
it.each([1, 2])('rejects failed headless stage %s', (stage) => {
  execute.mockImplementation(() => {
    if (execute.mock.calls.length === stage) throw new Error('Headless failed.');
  });
  expect(() => verifyHeadlessInstall(process.cwd(), '/checked.tgz', parent)).toThrow(
    'Headless failed',
  );
});
