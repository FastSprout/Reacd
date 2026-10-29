import { isReleaseVersion, PUBLICATION_POLICY } from './policy.js';

export interface PublicationMetadata {
  readonly name: 'reacd';
  readonly version: string;
  readonly peerDependencies: typeof PUBLICATION_POLICY.peers;
}

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

export function parsePublicationManifest(input: unknown): PublicationMetadata {
  const manifest = record(input);
  const policy = PUBLICATION_POLICY;
  matches(manifest['name'], policy.name);
  matches(manifest['private'], false);
  if (!isReleaseVersion(manifest['version'])) {
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
  for (const [name, version] of Object.entries(policy.peers)) {
    matches(peers[name], version);
    matches(dev[name], version);
    matches(dependencies[name], undefined);
  }
  return {
    name: policy.name,
    version: manifest['version'],
    peerDependencies: policy.peers,
  };
}
