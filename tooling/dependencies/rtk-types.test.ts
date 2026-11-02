import { createHash } from 'node:crypto';
import {
  copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync,
  symlinkSync, writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { TaskAbortError } from '@reduxjs/toolkit';
import { patchRtkDeclarations } from './rtk-types.js';
import { RTK_DECLARATION_POLICY as P } from './rtk-policy.js';

const roots: string[] = [];
const project = pathToFileURL(process.cwd() + '/');
const installed = new URL('node_modules/@reduxjs/toolkit/', project);
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function hash(path: URL) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}
function fixture() {
  const path = mkdtempSync(join(process.cwd(), '.cache/rtk-declarations-'));
  roots.push(path);
  const root = pathToFileURL(path + '/');
  const sdk = new URL('node_modules/@reduxjs/toolkit/', root);
  mkdirSync(new URL('dist/', sdk), { recursive: true });
  copyFileSync(new URL('package.json', installed), new URL('package.json', sdk));
  for (const name of P.files) {
    const current = readFileSync(new URL(name, installed), 'utf8');
    const original = P.edits.reduceRight(
      (source, edit) => source.replace(edit.after, edit.before), current,
    );
    writeFileSync(new URL(name, sdk), original);
    expect(hash(new URL(name, sdk))).toBe(P.originalHash);
  }
  copyFileSync(new URL('dist/uncheckedindexed.ts', installed),
    new URL('dist/uncheckedindexed.ts', sdk));
  copyFileSync(new URL('dist/redux-toolkit.modern.mjs', installed),
    new URL('dist/redux-toolkit.modern.mjs', sdk));
  return { root, sdk };
}

it('preserves actual SDK undefined abort-code behavior', () => {
  const error = new TaskAbortError(undefined);
  expect(Object.hasOwn(error, 'code')).toBe(true);
  expect(error.code).toBeUndefined();
  expect(typeof error.name).toBe('string');
  expect(typeof error.message).toBe('string');
});

it('patches only known declarations and is idempotent without changing runtime', () => {
  const f = fixture();
  const runtime = new URL('dist/redux-toolkit.modern.mjs', f.sdk);
  const before = readFileSync(runtime);
  expect(patchRtkDeclarations(f.root)).toBe(2);
  for (const name of P.files) expect(hash(new URL(name, f.sdk))).toBe(P.patchedHash);
  expect(patchRtkDeclarations(f.root)).toBe(0);
  expect(readFileSync(runtime)).toEqual(before);
});

it('patches a mixed installation without rewriting the known corrected entry', () => {
  const f = fixture();
  const first = new URL(P.files[0], f.sdk);
  const original = readFileSync(first, 'utf8');
  writeFileSync(first, P.edits.reduce(
    (source, edit) => source.replace(edit.before, edit.after), original,
  ));
  expect(patchRtkDeclarations(f.root)).toBe(1);
  for (const name of P.files) expect(hash(new URL(name, f.sdk))).toBe(P.patchedHash);
});

it('validates every original before writing either declaration', () => {
  const f = fixture();
  writeFileSync(new URL(P.files[1], f.sdk), 'Unknown declaration content');
  expect(() => patchRtkDeclarations(f.root)).toThrow('Unexpected RTK');
  expect(hash(new URL(P.files[0], f.sdk))).toBe(P.originalHash);
});

it.each([
  { name: '@reduxjs/toolkit', version: '2.14.0' },
  { name: 'untrusted', version: P.version },
])('rejects unverified metadata $name $version', (metadata) => {
  const f = fixture();
  writeFileSync(new URL('package.json', f.sdk), JSON.stringify(metadata));
  expect(() => patchRtkDeclarations(f.root)).toThrow();
  expect(hash(new URL(P.files[0], f.sdk))).toBe(P.originalHash);
});

it('rejects nonregular package metadata before reading it', () => {
  const f = fixture();
  const path = new URL('package.json', f.sdk);
  rmSync(path);
  mkdirSync(path);
  expect(() => patchRtkDeclarations(f.root)).toThrow('regular file');
});

it('rejects nonregular declarations before writing an earlier regular input', () => {
  const f = fixture();
  const path = new URL(P.files[1], f.sdk);
  rmSync(path);
  mkdirSync(path);
  expect(() => patchRtkDeclarations(f.root)).toThrow('regular file');
  expect(hash(new URL(P.files[0], f.sdk))).toBe(P.originalHash);
});

it('rejects declaration symlinks without following them for mutation', () => {
  const f = fixture();
  const path = new URL(P.files[1], f.sdk);
  rmSync(path);
  symlinkSync(new URL(P.files[0], f.sdk), path);
  expect(() => patchRtkDeclarations(f.root)).toThrow('regular file');
  expect(hash(new URL(P.files[0], f.sdk))).toBe(P.originalHash);
});

function compile(root: URL, fixtureName: string, formats: readonly string[]) {
  const source = readFileSync(new URL(
    `test-support/fixtures/rtk-${fixtureName}.ts.txt`, project,
  ), 'utf8');
  for (const format of formats) writeFileSync(new URL(`probe.${format}`, root), source);
  const config = new URL('tsconfig.json', root);
  writeFileSync(config, JSON.stringify({
    compilerOptions: { strict: true, exactOptionalPropertyTypes: true,
      skipLibCheck: false, module: 'NodeNext', moduleResolution: 'NodeNext',
      target: 'ES2022', lib: ['ES2022', 'DOM'], types: [], noEmit: true },
    files: formats.map(format => `probe.${format}`),
  }));
  const compiler = fileURLToPath(new URL(
    'node_modules/typescript/bin/tsc', project,
  ));
  return spawnSync(process.execPath, [compiler, '-p', fileURLToPath(config),
    '--pretty', 'false'], { encoding: 'utf8' });
}

it('proves strict ESM/CJS consumption and rejects circular configurations', () => {
  const f = fixture();
  const before = compile(f.root, 'positive', ['mts', 'cts']);
  expect(before.stderr).toBe('');
  expect(before.status).not.toBe(0);
  expect(before.stdout).toContain('TS2344');
  expect(before.stdout).toContain('TS2420');
  expect(patchRtkDeclarations(f.root)).toBe(2);
  const after = compile(f.root, 'positive', ['mts', 'cts']);
  expect(after.stdout + after.stderr).toBe('');
  expect(after.status).toBe(0);
  for (const field of ['state', 'dispatch']) {
    const rejected = compile(f.root, `circular-${field}`, ['mts']);
    expect(rejected.status).not.toBe(0);
    expect(rejected.stdout).toContain('TS2344');
    expect(rejected.stdout).toContain(`property '${field}'`);
    expect(rejected.stdout).toContain('undefined');
    expect(rejected.stdout).not.toContain('TS2420');
  }
}, 30_000);
