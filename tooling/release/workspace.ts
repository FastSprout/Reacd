import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  PUBLICATION_POLICY,
  SHADCN_PUBLICATION_POLICY,
  MUI_PUBLICATION_POLICY,
} from './policy.js';
import type { DistributionManifest } from './distribution.js';

export const PUBLICATION_FILES = PUBLICATION_POLICY.files;

export function stagePublication(
  root: string,
  directory: string,
  manifest: DistributionManifest,
): string {
  const workspace = join(directory, 'publication');
  mkdirSync(workspace);
  const profile =
    manifest.name === PUBLICATION_POLICY.name
      ? PUBLICATION_POLICY
      : manifest.name === MUI_PUBLICATION_POLICY.name
        ? MUI_PUBLICATION_POLICY
        : SHADCN_PUBLICATION_POLICY;
  for (const file of profile.files) {
    const target = join(workspace, file);
    mkdirSync(join(target, '..'), { recursive: true });
    cpSync(join(root, file), target, { recursive: true, verbatimSymlinks: true });
  }
  writeFileSync(join(workspace, 'package.json'), JSON.stringify(manifest, null, 2));
  return workspace;
}
