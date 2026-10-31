import { lstatSync, readFileSync } from 'node:fs';
import { RELEASE_ARCHIVE_POLICY } from '../tooling/release/archive.js';
import {
  parsePublicationManifest,
  parseShadcnPublicationManifest,
  parseMuiPublicationManifest,
} from '../tooling/release/metadata.js';
import {
  SHADCN_PUBLICATION_POLICY,
  MUI_PUBLICATION_POLICY,
  requiresMaterialPackage,
} from '../tooling/release/policy.js';
import { verifyRegistryPublication } from '../tooling/release/registry.js';

const root = new URL('../', import.meta.url);
const engineInput: unknown = JSON.parse(
  readFileSync(new URL('package.json', root), 'utf8'),
);
const engine = parsePublicationManifest(engineInput);
const packages: {
  manifest: string;
  archive: string;
  parse: (input: unknown) => import('../tooling/release/metadata.js').PackageMetadata;
}[] = [
  {
    manifest: 'packages/shadcn/package.json',
    archive: SHADCN_PUBLICATION_POLICY.output,
    parse: parseShadcnPublicationManifest,
  },
];
if (requiresMaterialPackage(engine.version))
  packages.push({
    manifest: 'packages/mui/package.json',
    archive: MUI_PUBLICATION_POLICY.output,
    parse: parseMuiPublicationManifest,
  });
const engineArchive = new URL(RELEASE_ARCHIVE_POLICY.output, root);
if (!lstatSync(engineArchive).isFile()) {
  throw new Error('Checked release archive must be a regular file.');
}
const confirmed = [
  await verifyRegistryPublication(engine, readFileSync(engineArchive)),
];
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
