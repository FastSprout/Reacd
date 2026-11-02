import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { afterEach, expect, it } from 'vitest';
import { patchRacDeclarations } from './rac-types.js';
import { RAC_DECLARATION_POLICY as P } from './rac-policy.js';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'reacd-rac-declarations-'));
  roots.push(path);
  const root = pathToFileURL(path + '/');
  const sdk = new URL('node_modules/react-aria-components/', root);
  mkdirSync(new URL('dist/types/src/', sdk), { recursive: true });
  writeFileSync(
    new URL('package.json', sdk),
    JSON.stringify({ name: 'react-aria-components', version: P.version }),
  );
  for (const entry of P.files) {
    const installed = readFileSync(
      join(process.cwd(), 'node_modules/react-aria-components', entry.name),
      'utf8',
    );
    writeFileSync(
      new URL(entry.name, sdk),
      installed.replace(entry.after, entry.before),
    );
  }
  return { root, sdk };
}

function hash(path: URL) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

it('preserves SDK properties without duplicate React inheritance', () => {
  const f = fixture();
  expect(patchRacDeclarations(f.root)).toBe(P.files.length);
  for (const entry of P.files) {
    expect(hash(new URL(entry.name, f.sdk))).toBe(entry.patchedHash);
  }
  expect(patchRacDeclarations(f.root)).toBe(0);
});

it('checks every declaration before changing any file', () => {
  const f = fixture();
  const [first, second] = P.files;
  writeFileSync(new URL(second.name, f.sdk), 'changed upstream declarations');
  expect(() => patchRacDeclarations(f.root)).toThrow('Unexpected RAC');
  expect(hash(new URL(first.name, f.sdk))).toBe(first.originalHash);
});

it('rejects an unverified SDK release', () => {
  const f = fixture();
  writeFileSync(
    new URL('package.json', f.sdk),
    JSON.stringify({ name: 'react-aria-components', version: '2.0.0' }),
  );
  expect(() => patchRacDeclarations(f.root)).toThrow();
});

it('rejects a nonregular declaration file', () => {
  const f = fixture();
  const path = new URL(P.files[0].name, f.sdk);
  rmSync(path);
  mkdirSync(path);
  expect(() => patchRacDeclarations(f.root)).toThrow('regular file');
});
