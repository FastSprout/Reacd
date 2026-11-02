import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { buildSite } from './site.js';
import { SITE_POLICY } from '../policy.js';
import { loadSite } from '../content/index.js';

vi.mock('../content/index.js', () => ({ loadSite: vi.fn() }));
vi.mock('../runtime/server.js', () => ({ renderSiteDocument: vi.fn() }));
const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
  roots.length = 0;
  vi.clearAllMocks();
});

it.each(['Not JSON', '{}'])
('rejects malformed runtime provenance before changing output: %s', async (data) => {
  const root = await mkdtemp(join(tmpdir(), 'reacd-runtime-metadata-'));
  roots.push(root);
  const runtime = resolve(root, SITE_POLICY.runtimeDirectory);
  await mkdir(join(runtime, '.vite'), { recursive: true });
  await writeFile(join(runtime, SITE_POLICY.runtimeManifestPath), data);
  await writeFile(join(runtime, SITE_POLICY.runtimeModulesName), '{}');
  const output = resolve(root, SITE_POLICY.outputDirectory);
  await mkdir(output);
  await writeFile(join(output, 'good.txt'), 'previous verified output');
  await expect(buildSite(root)).rejects.toThrow();
  expect(loadSite).not.toHaveBeenCalled();
  expect(await readFile(join(output, 'good.txt'), 'utf8'))
    .toBe('previous verified output');
});
