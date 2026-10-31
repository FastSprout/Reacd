import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { releasePackFixture } from '../../test-support/release-pack.js';
import { createDistributionManifest } from './distribution.js';
import { stagePublication } from './workspace.js';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

it('copies consumer assets and preserves source README and metadata bytes', () => {
  const fixture = releasePackFixture();
  roots.push(fixture.root);
  fixture.write('.env', 'never ship this');
  fixture.write('node_modules/private.js', 'never ship this either');
  const original = readFileSync(join(fixture.root, 'package.json'));
  const parent = join(fixture.root, 'temporary');
  mkdirSync(parent);
  const metadata = createDistributionManifest(fixture.manifest);
  const workspace = stagePublication(fixture.root, parent, metadata);
  expect(readdirSync(workspace).sort()).toEqual([
    'LICENSE',
    'README.md',
    'dist',
    'package.json',
    'schema',
  ]);
  expect(readFileSync(join(workspace, 'README.md'))).toEqual(
    readFileSync(join(fixture.root, 'README.md')),
  );
  expect(readFileSync(join(fixture.root, 'package.json'))).toEqual(original);
  expect(existsSync(join(workspace, '.env'))).toBe(false);
  const manifest: unknown = JSON.parse(
    readFileSync(join(workspace, 'package.json'), 'utf8'),
  );
  expect(manifest).toEqual(metadata);
});
