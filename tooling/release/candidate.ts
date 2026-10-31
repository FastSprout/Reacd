import { lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RELEASE_SOURCE_POLICY } from './github-client.js';
import {
  parsePublicationManifest,
  parseShadcnPublicationManifest,
  parseMuiPublicationManifest,
} from './metadata.js';
import type { PackageMetadata } from './metadata.js';
import {
  PUBLICATION_POLICY as P,
  SHADCN_PUBLICATION_POLICY as S,
  MUI_PUBLICATION_POLICY as M,
  requiresMaterialPackage,
} from './policy.js';
import type { CheckedPackages } from './publish.js';
import type { ReleaseIdentity } from './verify-environment.js';

function readPackage<Metadata extends PackageMetadata>(
  manifest: URL,
  archive: URL,
  parse: (input: unknown) => Metadata,
) {
  const raw = readFileSync(manifest, 'utf8');
  const input: unknown = JSON.parse(raw);
  const metadata = parse(input);
  if (!lstatSync(archive).isFile()) {
    throw new Error('Release candidate archive must be a regular file.');
  }
  return {
    metadata,
    archivePath: fileURLToPath(archive),
    bytes: readFileSync(archive),
    raw,
  };
}

export function readSourcePackages(source: URL) {
  const engine = readPackage(
    new URL('package.json', source),
    new URL(P.output, source),
    parsePublicationManifest,
  );
  const adapter = readPackage(
    new URL('packages/shadcn/package.json', source),
    new URL(S.output, source),
    parseShadcnPublicationManifest,
  );
  if (!requiresMaterialPackage(engine.metadata.version))
    return [engine, adapter] as const;
  return [
    engine,
    adapter,
    readPackage(
      new URL('packages/mui/package.json', source),
      new URL(M.output, source),
      parseMuiPublicationManifest,
    ),
  ] as const;
}

export function prepareReleaseCandidate(
  root: URL,
  source: URL,
  identity: ReleaseIdentity,
): CheckedPackages {
  const packages = readSourcePackages(source);
  if (packages.some((item) => item.metadata.version !== identity.version)) {
    throw new Error('Release candidate source versions must match.');
  }
  const directory = new URL(RELEASE_SOURCE_POLICY.artifactDirectory, root);
  mkdirSync(directory, { recursive: true });
  for (const item of packages) {
    const policy =
      item.metadata.name === P.name ? P : item.metadata.name === S.name ? S : M;
    const name =
      policy === P ? 'engine.json' : policy === S ? 'adapter.json' : 'mui.json';
    writeFileSync(new URL(name, directory), item.raw);
    writeFileSync(
      new URL(`${policy.archiveBasename}-${identity.version}.tgz`, directory),
      item.bytes,
    );
  }
  return readReleaseCandidate(root, identity);
}

export function readReleaseCandidate(
  root: URL,
  identity: ReleaseIdentity,
): CheckedPackages {
  const directory = new URL(RELEASE_SOURCE_POLICY.artifactDirectory, root);
  const engine = readPackage(
    new URL('engine.json', directory),
    new URL(`${P.archiveBasename}-${identity.version}.tgz`, directory),
    parsePublicationManifest,
  );
  const adapter = readPackage(
    new URL('adapter.json', directory),
    new URL(`${S.archiveBasename}-${identity.version}.tgz`, directory),
    parseShadcnPublicationManifest,
  );
  if (!requiresMaterialPackage(identity.version)) return [engine, adapter];
  return [
    engine,
    adapter,
    readPackage(
      new URL('mui.json', directory),
      new URL(`${M.archiveBasename}-${identity.version}.tgz`, directory),
      parseMuiPublicationManifest,
    ),
  ];
}
