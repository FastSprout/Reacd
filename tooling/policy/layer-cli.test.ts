import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('fails the actual CLI for a type-only cycle and accepts repaired sources', () => {
  const root = mkdtempSync(join(tmpdir(), 'reacd-layer-cli-'));
  const directory = join(root, 'src/core');
  mkdirSync(directory, { recursive: true });
  const a = join(directory, 'a.ts');
  const b = join(directory, 'b.ts');
  writeFileSync(a, "import type { B } from './b.js';");
  writeFileSync(b, "\nexport type { A } from './a.js';");
  const execute = () =>
    spawnSync(
      process.execPath,
      [
        '--import',
        resolve('node_modules/tsx/dist/loader.mjs'),
        resolve('scripts/lint-layers.ts'),
      ],
      { cwd: root, encoding: 'utf8' },
    );
  try {
    const failure = execute();
    expect(failure.status).toBe(1);
    expect(failure.stderr).toContain(`${b}:2:1 [architecture-cycle]`);
    writeFileSync(b, 'export type B = string;');
    const success = execute();
    expect(success.status).toBe(0);
    expect(success.stderr).toBe('');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it('fails the CLI for adapter CSS imports and accepts native token styles', () => {
  const root = mkdtempSync(join(tmpdir(), 'reacd-native-css-cli-'));
  const directory = join(root, 'src/adapter/mui');
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, 'native.ts'), 'export {};');
  const stylesheet = join(directory, 'styles.css');
  writeFileSync(stylesheet, "@import '../../renderer/styles.css';");
  const execute = () =>
    spawnSync(
      process.execPath,
      [
        '--import',
        resolve('node_modules/tsx/dist/loader.mjs'),
        resolve('scripts/lint-layers.ts'),
      ],
      { cwd: root, encoding: 'utf8' },
    );
  try {
    const failure = execute();
    expect(failure.status).toBe(1);
    expect(failure.stderr).toContain(`${stylesheet}:1:1 [architecture]`);
    writeFileSync(stylesheet, ':root { --primary: red; }');
    const success = execute();
    expect(success.status).toBe(0);
    expect(success.stderr).toBe('');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
