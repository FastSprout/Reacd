import {
  isReleaseVersion,
  PUBLICATION_POLICY,
  MUI_PUBLICATION_POLICY,
  SHADCN_PUBLICATION_POLICY,
} from './policy.js';
import type { PublicationPolicy } from './policy.js';

export interface PublicationMetadata {
  readonly name: '@fastsprout/reacd';
  readonly version: string;
  readonly peerDependencies: typeof PUBLICATION_POLICY.peers;
}
export interface ShadcnPublicationMetadata {
  readonly name: '@fastsprout/reacd-shadcn';
  readonly version: string;
  readonly peerDependencies: typeof PUBLICATION_POLICY.peers &
    Readonly<Record<'@fastsprout/reacd', string>>;
}
export interface MuiPublicationMetadata {
  readonly name: '@fastsprout/reacd-mui';
  readonly version: string;
  readonly peerDependencies: ShadcnPublicationMetadata['peerDependencies'];
}
export type PackageMetadata =
  PublicationMetadata | ShadcnPublicationMetadata | MuiPublicationMetadata;

function record(input: unknown): Record<string, unknown> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Publication manifest requires object metadata.');
  }
  return Object.fromEntries(Object.entries(input));
}
function matches(input: unknown, expected: unknown): void {
  if (input !== expected) {
    throw new Error('Publication manifest does not match release policy.');
  }
}
function validate(input: unknown, policy: PublicationPolicy): string {
  const manifest = record(input);
  matches(manifest['name'], policy.name);
  matches(manifest['private'], false);
  const version = manifest['version'];
  if (!isReleaseVersion(version)) {
    throw new Error('Publication manifest requires a valid SemVer version.');
  }
  const repository = record(manifest['repository']);
  matches(repository['type'], 'git');
  matches(repository['url'], policy.repository);
  matches(manifest['homepage'], policy.homepage);
  matches(record(manifest['bugs'])['url'], policy.issues);
  const publish = record(manifest['publishConfig']);
  matches(publish['access'], 'public');
  matches(publish['registry'], policy.registry);
  matches(record(manifest['engines'])['node'], policy.node);
  const peers = record(manifest['peerDependencies']);
  const dev = record(manifest['devDependencies']);
  const dependencies = record(
    manifest['dependencies'] === undefined ? {} : manifest['dependencies'],
  );
  if (policy.name !== PUBLICATION_POLICY.name) {
    matches(peers[PUBLICATION_POLICY.name], version);
  }
  if (policy.name !== PUBLICATION_POLICY.name) {
    matches(dependencies[PUBLICATION_POLICY.name], undefined);
    matches(dev[PUBLICATION_POLICY.name], undefined);
  }
  for (const [name, expected] of Object.entries(policy.peers)) {
    matches(peers[name], expected);
  }
  for (const [name, expected] of Object.entries(PUBLICATION_POLICY.peers)) {
    matches(dev[name], expected);
    matches(dependencies[name], undefined);
  }
  return version;
}
export function parsePublicationManifest(input: unknown): PublicationMetadata {
  return {
    name: PUBLICATION_POLICY.name,
    version: validate(input, PUBLICATION_POLICY),
    peerDependencies: PUBLICATION_POLICY.peers,
  };
}
export function parseShadcnPublicationManifest(
  input: unknown,
): ShadcnPublicationMetadata {
  const version = validate(input, SHADCN_PUBLICATION_POLICY);
  return {
    name: SHADCN_PUBLICATION_POLICY.name,
    version,
    peerDependencies: { ...PUBLICATION_POLICY.peers, '@fastsprout/reacd': version },
  };
}

export function parseMuiPublicationManifest(input: unknown): MuiPublicationMetadata {
  const version = validate(input, MUI_PUBLICATION_POLICY);
  return {
    name: MUI_PUBLICATION_POLICY.name,
    version,
    peerDependencies: { ...PUBLICATION_POLICY.peers, '@fastsprout/reacd': version },
  };
}
