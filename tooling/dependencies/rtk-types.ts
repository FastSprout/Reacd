import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { RTK_DECLARATION_POLICY as P } from './rtk-policy.js';

const packageSchema = z.object({
  name: z.literal('@reduxjs/toolkit'),
  version: z.literal(P.version),
});

export function patchRtkDeclarations(root: URL): number {
  const sdk = new URL('node_modules/@reduxjs/toolkit/', root);
  const metadataPath = new URL('package.json', sdk);
  if (!lstatSync(metadataPath).isFile()) {
    throw new Error('RTK package metadata must be a regular file.');
  }
  const metadata: unknown = JSON.parse(readFileSync(metadataPath, 'utf8'));
  packageSchema.parse(metadata);
  const plan = P.files.map((name) => {
    const path = new URL(name, sdk);
    if (!lstatSync(path).isFile()) {
      throw new Error('RTK declarations must be a regular file.');
    }
    const original = readFileSync(path, 'utf8');
    const hash = createHash('sha256').update(original).digest('hex');
    if (hash === P.patchedHash) return null;
    if (hash !== P.originalHash) {
      throw new Error('Unexpected RTK declarations; refusing to patch.');
    }
    const source = P.edits.reduce(
      (current, edit) => current.replace(edit.before, edit.after), original,
    );
    return { path, source };
  });
  let changed = 0;
  for (const entry of plan) {
    if (entry === null) continue;
    writeFileSync(entry.path, entry.source);
    changed++;
  }
  return changed;
}
