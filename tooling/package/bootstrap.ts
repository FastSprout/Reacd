import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function buildInstalledBootstrap(root: string, consumer: string): void {
  const fixtures = resolve(root, 'tooling/package/fixtures');
  for (const [fixture, target] of [
    ['bootstrap.tsx.txt', 'bootstrap.tsx'],
    ['bootstrap.html.txt', 'index.html'],
  ] as const) {
    writeFileSync(join(consumer, target),
      readFileSync(join(fixtures, fixture), 'utf8'));
  }
  writeFileSync(join(consumer, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      jsx: 'react-jsx', jsxImportSource: '@fastsprout/reacd', strict: true,
    },
  }));
  execFileSync(process.execPath, [
    resolve(root, 'node_modules/vite/bin/vite.js'), 'build',
  ], { cwd: consumer, stdio: 'inherit' });
  const assets = join(consumer, 'dist/assets');
  const styles = readdirSync(assets).filter((name) => name.endsWith('.css'));
  assert(styles.length > 0, 'Installed bootstrap did not emit CSS.');
  for (const stylesheet of styles) {
    assert(statSync(join(assets, stylesheet)).size > 0,
      'Installed bootstrap emitted empty CSS.');
  }
}
