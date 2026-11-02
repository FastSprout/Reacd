import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { MUI_X_DECLARATION_POLICY as P } from './mui-x-policy.js';

const packageSchema = z.object({
  name: z.literal('@mui/x-date-pickers'), version: z.literal(P.version),
});

export function patchMuiXDeclarations(root: URL): number {
  const sdk = new URL('node_modules/@mui/x-date-pickers/', root);
  const metadata: unknown = JSON.parse(
    readFileSync(new URL('package.json', sdk), 'utf8'),
  );
  packageSchema.parse(metadata);
  const plan = P.files.map((file) => {
    const path = new URL(file.name, sdk);
    if (!lstatSync(path).isFile()) {
      throw new Error('MUI X declarations must be a regular file.');
    }
    const source = readFileSync(path, 'utf8');
    const hash = createHash('sha256').update(source).digest('hex');
    if (hash === file.patched) return null;
    if (hash !== file.original) {
      throw new Error('Unexpected MUI X locale declarations; refusing to patch.');
    }
    const next = source.replace(file.before, file.after);
    if (createHash('sha256').update(next).digest('hex') !== file.patched) {
      throw new Error('MUI X transformed hash did not match; refusing to patch.');
    }
    return { path, source: next };
  });
  let changed = 0;
  for (const entry of plan) {
    if (entry === null) continue;
    writeFileSync(entry.path, entry.source);
    changed++;
  }
  return changed;
}
