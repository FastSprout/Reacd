import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { RAC_DECLARATION_POLICY as P } from './rac-policy.js';

const packageSchema = z.object({
  name: z.literal('react-aria-components'),
  version: z.literal(P.version),
});

export function patchRacDeclarations(root: URL): number {
  const sdk = new URL('node_modules/react-aria-components/', root);
  const metadata: unknown = JSON.parse(
    readFileSync(new URL('package.json', sdk), 'utf8'),
  );
  packageSchema.parse(metadata);
  const plan = P.files.map((entry) => {
    const path = new URL(entry.name, sdk);
    if (!lstatSync(path).isFile()) {
      throw new Error('RAC declarations must be a regular file.');
    }
    const source = readFileSync(path, 'utf8');
    const hash = createHash('sha256').update(source).digest('hex');
    if (hash === entry.patchedHash) return null;
    if (hash !== entry.originalHash) {
      throw new Error('Unexpected RAC declarations; refusing to patch.');
    }
    return { path, source: source.replace(entry.before, entry.after) };
  });
  let changed = 0;
  for (const entry of plan) {
    if (entry === null) continue;
    writeFileSync(entry.path, entry.source);
    changed++;
  }
  return changed;
}
