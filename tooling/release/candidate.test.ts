import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, expect, it } from 'vitest';
import { z } from 'zod';
import { prepareReleaseCandidate, readReleaseCandidate } from './candidate.js';

const directories: string[] = [];
const identity = { sha: 'a'.repeat(40), tag: 'v0.2.0', version: '0.2.0' };
afterEach(() => {
  for (const path of directories.splice(0))
    rmSync(path, { recursive: true, force: true });
});
function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'reacd-candidate-'));
  directories.push(path);
  const root = pathToFileURL(path + '/');
  const source = new URL('source/', root);
  mkdirSync(new URL('packages/shadcn/', source), { recursive: true });
  mkdirSync(new URL('.cache/release/', source), { recursive: true });
  for (const manifest of ['package.json', 'packages/shadcn/package.json']) {
    const input: unknown = JSON.parse(readFileSync(manifest, 'utf8'));
    const record = z.record(z.string(), z.unknown()).parse(input);
    const peers = z.record(z.string(), z.string()).parse(record['peerDependencies']);
    writeFileSync(
      new URL(manifest, source),
      JSON.stringify({
        ...record,
        version: identity.version,
        peerDependencies: {
          ...peers,
          ...(manifest.startsWith('packages/') ? { '@fastsprout/reacd': '0.2.0' } : {}),
        },
      }),
    );
  }
  writeFileSync(new URL('.cache/release/package.tgz', source), 'engine bytes');
  writeFileSync(new URL('.cache/release/shadcn.tgz', source), 'adapter bytes');
  return { root, source };
}
it('stages and reads the two versioned archives without changing bytes', () => {
  const f = fixture();
  const packages = prepareReleaseCandidate(f.root, f.source, identity);
  expect(packages.map((p) => p.metadata.name)).toEqual([
    '@fastsprout/reacd',
    '@fastsprout/reacd-shadcn',
  ]);
  expect(packages[0].bytes.toString()).toBe('engine bytes');
  expect(packages[1].bytes.toString()).toBe('adapter bytes');
  expect(readReleaseCandidate(f.root, identity)).toEqual(packages);
});
it.each(['package.json', 'packages/shadcn/package.json'])(
  'rejects a different %s version before producing publication artifacts',
  (name) => {
    const f = fixture();
    const file = new URL(name, f.source);
    const input: unknown = JSON.parse(readFileSync(file, 'utf8'));
    const record = z.record(z.string(), z.unknown()).parse(input);
    const peers = z.record(z.string(), z.string()).parse(record['peerDependencies']);
    writeFileSync(
      file,
      JSON.stringify({
        ...record,
        version: '0.1.0',
        peerDependencies: {
          ...peers,
          ...(name.startsWith('packages/') ? { '@fastsprout/reacd': '0.1.0' } : {}),
        },
      }),
    );
    expect(() => prepareReleaseCandidate(f.root, f.source, identity)).toThrow(
      'source versions',
    );
  },
);
it('refuses nonregular archive inputs', () => {
  const f = fixture();
  const archive = new URL('.cache/release/package.tgz', f.source);
  rmSync(archive);
  mkdirSync(archive);
  expect(() => prepareReleaseCandidate(f.root, f.source, identity)).toThrow(
    'regular file',
  );
});
