import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { afterEach, expect, it } from 'vitest';
import { patchMuiDeclarations } from './mui-types.js';
import { MUI_DECLARATION_POLICY as P } from './mui-policy.js';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'reacd-mui-declarations-'));
  roots.push(path);
  const root = pathToFileURL(path + '/');
  const sdk = new URL('node_modules/@mui/material/', root);
  mkdirSync(new URL('transitions/', sdk), { recursive: true });
  writeFileSync(
    new URL('package.json', sdk),
    JSON.stringify({
      name: '@mui/material',
      version: '9.5.0',
    }),
  );
  for (const name of P.files) {
    const installed = readFileSync(
      join(process.cwd(), 'node_modules/@mui/material/transitions', name),
      'utf8',
    );
    writeFileSync(
      new URL(`transitions/${name}`, sdk),
      installed.replace(P.after, P.before),
    );
  }
  return { root, sdk };
}

it('corrects only the two known declaration files and is idempotent', () => {
  const f = fixture();
  expect(patchMuiDeclarations(f.root)).toBe(P.files.length);
  for (const name of P.files) {
    const bytes = readFileSync(new URL(`transitions/${name}`, f.sdk));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(P.patchedHash);
  }
  expect(patchMuiDeclarations(f.root)).toBe(0);
});

it('verifies every input before writing any declaration', () => {
  const f = fixture();
  writeFileSync(new URL('transitions/types.d.ts', f.sdk), 'unexpected declarations');
  expect(() => patchMuiDeclarations(f.root)).toThrow('Unexpected MUI');
  const first = readFileSync(new URL('transitions/types.d.mts', f.sdk));
  expect(createHash('sha256').update(first).digest('hex')).toBe(P.originalHash);
});

it('rejects an unknown SDK version', () => {
  const f = fixture();
  writeFileSync(
    new URL('package.json', f.sdk),
    JSON.stringify({
      name: '@mui/material',
      version: '9.6.0',
    }),
  );
  expect(() => patchMuiDeclarations(f.root)).toThrow();
});

it('rejects a declaration path that is not a regular file', () => {
  const f = fixture();
  const file = new URL('transitions/types.d.mts', f.sdk);
  rmSync(file);
  mkdirSync(file);
  expect(() => patchMuiDeclarations(f.root)).toThrow('regular file');
});
