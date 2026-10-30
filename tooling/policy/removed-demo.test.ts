import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, URL as NodeURL } from 'node:url';
import { expect, it } from 'vitest';
import { z } from 'zod';

const repository = fileURLToPath(new NodeURL('../../', import.meta.url));

it('removes the public demo and starts a runnable TSX example by default', () => {
  expect(existsSync(`${repository}demo`)).toBe(false);
  const manifest: unknown = JSON.parse(
    readFileSync(`${repository}package.json`, 'utf8'),
  );
  const { scripts } = z
    .object({ scripts: z.object({ dev: z.string() }) })
    .parse(manifest);
  expect(scripts.dev).toContain('--config vite.examples.config.ts');
});
