import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { verifyMaterialInstall } from './material.js';

const { execute, build, browser } = vi.hoisted(() => ({
  execute: vi.fn(),
  build: vi.fn(),
  browser: vi.fn(),
}));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
vi.mock('./bootstrap.js', () => ({ buildInstalledBootstrap: build }));
vi.mock('./browser.js', () => ({ exerciseInstalledBootstrap: browser }));

it('checks an independent Material archive with strict consumers', async () => {
  const root = process.cwd();
  const parent = mkdtempSync(join(tmpdir(), 'reacd-material-test-'));
  try {
    await verifyMaterialInstall(root, '/engine.tgz', '/mui.tgz', parent);
    const consumer = join(parent, 'material-consumer');
    expect(readFileSync(join(consumer, 'consumer.tsx'), 'utf8')).toContain(
      "from '@fastsprout/reacd-mui'",
    );
    expect(readFileSync(join(consumer, 'runtime.mjs'), 'utf8')).toContain(
      'data-adapter="material-ui"',
    );
    expect(readFileSync(join(consumer, 'tsconfig.json'), 'utf8')).toContain(
      '"skipLibCheck":false',
    );
    expect(execute).toHaveBeenCalledWith(
      'npm',
      expect.arrayContaining(['install', '--ignore-scripts', '--package-lock=false']),
      { cwd: consumer, stdio: 'inherit' },
    );
    expect(build).toHaveBeenCalledWith(root, consumer, 'mui');
    expect(browser).toHaveBeenCalledWith(consumer);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});
