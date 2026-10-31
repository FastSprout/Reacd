import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { MUI_DECLARATION_POLICY as P } from './mui-policy.js';

const packageSchema = z.object({
  name: z.literal('@mui/material'),
  version: z.literal(P.version),
});

export function patchMuiDeclarations(root: URL): number {
  const sdk = new URL('node_modules/@mui/material/', root);
  const metadata: unknown = JSON.parse(
    readFileSync(new URL('package.json', sdk), 'utf8'),
  );
  packageSchema.parse(metadata);
  const plan = P.files.map((name) => {
    const path = new URL(`transitions/${name}`, sdk);
    if (!lstatSync(path).isFile()) {
      throw new Error('MUI declarations must be a regular file.');
    }
    const source = readFileSync(path, 'utf8');
    const hash = createHash('sha256').update(source).digest('hex');
    if (hash === P.patchedHash) return null;
    if (hash !== P.originalHash) {
      throw new Error('Unexpected MUI transition declarations; refusing to patch.');
    }
    return { path, source: source.replace(P.before, P.after) };
  });
  let changed = 0;
  for (const entry of plan) {
    if (entry === null) continue;
    writeFileSync(entry.path, entry.source);
    changed++;
  }
  return changed;
}
