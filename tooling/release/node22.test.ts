import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import { z } from 'zod';
import { verifyRegistryPublication } from './registry.js';
import type { RegistryFetch } from './registry.js';

const manifest = z.object({
  name: z.string(),
  version: z.literal('0.3.0'),
  engines: z.object({ node: z.literal('>=22.12.0') }),
});

it.each(['package.json', 'packages/shadcn/package.json', 'packages/mui/package.json'])(
  'declares the verified Node.js 22 floor in %s',
  (path) => {
    const input: unknown = JSON.parse(readFileSync(path, 'utf8'));
    expect(manifest.safeParse(input).success).toBe(true);
  },
);

it('pins Node.js 22 for local development and hosted checks', () => {
  expect(readFileSync('.nvmrc', 'utf8').trim()).toBe('22.23.4');
  for (const path of ['.github/workflows/check.yml', '.github/workflows/release.yml']) {
    expect(readFileSync(path, 'utf8')).toContain("NODE_VERSION: '22.23.4'");
  }
});

it('confirms exact archive bytes after six minutes of npm processing', async () => {
  const identity = { name: '@fastsprout/reacd', version: '0.3.0' };
  const archive = new TextEncoder().encode('checked release');
  const integrity = 'sha512-' + createHash('sha512').update(archive).digest('base64');
  const tarball = 'https://registry.npmjs.org/@fastsprout/reacd/-/reacd-0.3.0.tgz';
  let elapsed = 0;
  const fetch: RegistryFetch = async () => ({
    status: elapsed < 360_000 ? 404 : 200,
    json: async () => ({ ...identity, dist: { integrity, tarball } }),
    arrayBuffer: async () => archive.slice().buffer,
  });
  await expect(
    verifyRegistryPublication(identity, archive, {
      fetch,
      sleep: async (delay) => {
        elapsed += delay;
      },
    }),
  ).resolves.toEqual({ ...identity, integrity });
  expect(elapsed).toBeGreaterThanOrEqual(360_000);
  expect(elapsed).toBeLessThanOrEqual(1_200_000);
});
