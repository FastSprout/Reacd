import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  parsePublicationManifest,
  parseShadcnPublicationManifest,
} from '../tooling/release/metadata.js';
import type { PackageMetadata } from '../tooling/release/metadata.js';
import {
  PUBLICATION_POLICY,
  SHADCN_PUBLICATION_POLICY,
} from '../tooling/release/policy.js';
import { publishCheckedPackages } from '../tooling/release/publish.js';
import {
  lookupRegistryPublication,
  verifyRegistryPublication,
} from '../tooling/release/registry.js';

const root = new URL('../', import.meta.url);
function checkedPackage<Metadata extends PackageMetadata>(
  manifest: string,
  archivePath: string,
  parse: (input: unknown) => Metadata,
) {
  const input: unknown = JSON.parse(readFileSync(new URL(manifest, root), 'utf8'));
  const metadata = parse(input);
  const archive = new URL(archivePath, root);
  if (!lstatSync(archive).isFile()) {
    throw new Error('Checked release archive must be a regular file.');
  }
  return {
    metadata,
    archivePath: fileURLToPath(archive),
    bytes: readFileSync(archive),
  };
}
const engine = checkedPackage(
  'package.json',
  PUBLICATION_POLICY.output,
  parsePublicationManifest,
);
const adapter = checkedPackage(
  'packages/shadcn/package.json',
  SHADCN_PUBLICATION_POLICY.output,
  parseShadcnPublicationManifest,
);
await publishCheckedPackages([engine, adapter], {
  lookup: lookupRegistryPublication,
  verify: verifyRegistryPublication,
  upload(archivePath) {
    execFileSync('npm', ['publish', archivePath, '--access', 'public'], {
      stdio: 'inherit',
    });
  },
});
console.log('Both checked packages are publicly verified.');
