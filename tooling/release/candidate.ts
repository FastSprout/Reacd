import { lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RELEASE_SOURCE_POLICY } from './github-client.js';
import {
  parsePublicationManifest,
  parseShadcnPublicationManifest,
} from './metadata.js';
import type { PackageMetadata } from './metadata.js';
import { PUBLICATION_POLICY as P, SHADCN_PUBLICATION_POLICY as S } from './policy.js';
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

export function prepareReleaseCandidate(
  root: URL,
  source: URL,
  identity: ReleaseIdentity,
): CheckedPackages {
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
  if (
    engine.metadata.version !== identity.version ||
    adapter.metadata.version !== identity.version
  ) {
    throw new Error('Release candidate source versions must match.');
  }
  const directory = new URL(RELEASE_SOURCE_POLICY.artifactDirectory, root);
  mkdirSync(directory, { recursive: true });
  for (const [item, policy, name] of [
    [engine, P, 'engine.json'],
    [adapter, S, 'adapter.json'],
  ] as const) {
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
  return [
    readPackage(
      new URL('engine.json', directory),
      new URL(`${P.archiveBasename}-${identity.version}.tgz`, directory),
      parsePublicationManifest,
    ),
    readPackage(
      new URL('adapter.json', directory),
      new URL(`${S.archiveBasename}-${identity.version}.tgz`, directory),
      parseShadcnPublicationManifest,
    ),
  ];
}
