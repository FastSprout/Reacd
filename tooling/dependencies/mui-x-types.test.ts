import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
import { patchMuiXDeclarations } from './mui-x-types.js';
import { MUI_X_DECLARATION_POLICY as P } from './mui-x-policy.js';

const roots: string[] = [];
afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

it('rejects a faulty transform before writing any declaration', () => {
  const f = fixture();
  vi.spyOn(String.prototype, 'replace').mockReturnValueOnce('invalid transform');
  expect(() => patchMuiXDeclarations(f.root)).toThrow('transformed hash');
  const first = readFileSync(new URL(P.files[0].name, f.sdk));
  expect(createHash('sha256').update(first).digest('hex')).toBe(P.files[0].original);
});

function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'reacd-mui-declarations-'));
  roots.push(path);
  const root = pathToFileURL(path + '/');
  const sdk = new URL('node_modules/@mui/x-date-pickers/', root);
  mkdirSync(sdk, { recursive: true });
  writeFileSync(
    new URL('package.json', sdk),
    JSON.stringify({
      name: '@mui/x-date-pickers',
      version: '9.17.0',
    }),
  );
  for (const name of P.files) {
    mkdirSync(new URL('.', new URL(name.name, sdk)), { recursive: true });
    const installed = readFileSync(
      join(process.cwd(), 'node_modules/@mui/x-date-pickers', name.name),
      'utf8',
    );
    writeFileSync(
      new URL(name.name, sdk),
      installed.replace(name.after, name.before),
    );
  }
  return { root, sdk };
}

it('corrects only the known declaration files and is idempotent', () => {
  const f = fixture();
  expect(patchMuiXDeclarations(f.root)).toBe(P.files.length);
  for (const name of P.files) {
    const bytes = readFileSync(new URL(name.name, f.sdk));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(name.patched);
  }
  expect(patchMuiXDeclarations(f.root)).toBe(0);
});

it('verifies every input before writing any declaration', () => {
  const f = fixture();
  writeFileSync(
    new URL('locales/utils/pickersLocaleTextApi.d.ts', f.sdk),
    'unexpected declarations',
  );
  expect(() => patchMuiXDeclarations(f.root)).toThrow('Unexpected MUI X');
  const first = readFileSync(
    new URL('locales/utils/pickersLocaleTextApi.d.mts', f.sdk),
  );
  expect(createHash('sha256').update(first).digest('hex')).toBe(P.files[0].original);
});

it('rejects an unknown SDK version', () => {
  const f = fixture();
  writeFileSync(
    new URL('package.json', f.sdk),
    JSON.stringify({
      name: '@mui/x-date-pickers',
      version: '9.18.0',
    }),
  );
  expect(() => patchMuiXDeclarations(f.root)).toThrow();
});

it('rejects a declaration path that is not a regular file', () => {
  const f = fixture();
  const file = new URL('locales/utils/pickersLocaleTextApi.d.mts', f.sdk);
  rmSync(file);
  mkdirSync(file);
  expect(() => patchMuiXDeclarations(f.root)).toThrow('regular file');
});
