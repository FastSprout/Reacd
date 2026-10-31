import { lstatSync, readFileSync } from 'node:fs';
import { RELEASE_ARCHIVE_POLICY } from '../tooling/release/archive.js';
import {
  parsePublicationManifest,
  parseShadcnPublicationManifest,
} from '../tooling/release/metadata.js';
import { SHADCN_PUBLICATION_POLICY } from '../tooling/release/policy.js';
import { verifyRegistryPublication } from '../tooling/release/registry.js';

const root = new URL('../', import.meta.url);
const packages = [
  {
    manifest: 'package.json',
    archive: RELEASE_ARCHIVE_POLICY.output,
    parse: parsePublicationManifest,
  },
  {
    manifest: 'packages/shadcn/package.json',
    archive: SHADCN_PUBLICATION_POLICY.output,
    parse: parseShadcnPublicationManifest,
  },
];
const confirmed = [];
for (const publication of packages) {
  const input: unknown = JSON.parse(
    readFileSync(new URL(publication.manifest, root), 'utf8'),
  );
  const metadata = publication.parse(input);
  const archive = new URL(publication.archive, root);
  if (!lstatSync(archive).isFile()) {
    throw new Error('Checked release archive must be a regular file.');
  }
  confirmed.push(await verifyRegistryPublication(metadata, readFileSync(archive)));
}
for (const verified of confirmed) {
  console.log(
    `Public registry verified: ${verified.name}@${verified.version} ` +
      `(${verified.integrity}).`,
  );
}
