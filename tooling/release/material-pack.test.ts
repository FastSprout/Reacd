import { existsSync, readFileSync, rmSync } from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import {
  releasePackFixture,
  runFixtureCommand,
} from '../../test-support/release-pack.js';
import { packMuiArchive } from './pack.js';

const { execute } = vi.hoisted(() => ({
  execute:
    vi.fn<
      (
        command: string,
        args: readonly string[],
        options: { cwd: string; encoding: 'utf8' },
      ) => string
    >(),
}));
vi.mock('node:child_process', async (original) => ({
  ...(await original<typeof import('node:child_process')>()),
  execFileSync: execute,
}));
const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  execute.mockReset();
});
it('stages only Material assets and verifies the immutable archive bytes', () => {
  const f = releasePackFixture('mui', '0.3.0');
  roots.push(f.root);
  execute.mockImplementation((file, arguments_, options) => {
    if (file === 'npm') {
      const destination = arguments_[arguments_.indexOf('--pack-destination') + 1];
      if (typeof destination !== 'string' || typeof options?.cwd !== 'string') {
        throw new Error('Missing test pack locations.');
      }
      return JSON.stringify(f.pack(destination, options.cwd));
    }
    if (typeof options?.cwd !== 'string') throw new Error('Missing cwd.');
    return runFixtureCommand(file, arguments_, options.cwd);
  });
  const archive = packMuiArchive(f.root);
  expect(existsSync(archive)).toBe(true);
  expect(readFileSync(archive).byteLength).toBeGreaterThan(0);
});
