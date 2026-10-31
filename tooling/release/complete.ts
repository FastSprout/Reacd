import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { z } from 'zod';
import type { ReleaseGitHub } from './github-client.js';
import { resolveReleaseTag, releaseShaSchema } from './github-client.js';
import type { CheckedPackages, PublicationIO } from './publish.js';
import { verifyRegistryPublication } from './registry.js';
import type { ReleaseIdentity } from './verify-environment.js';

const releaseSchema = z.object({
  id: z.number().int().positive(),
  tag_name: z.string(),
  draft: z.boolean(),
  body: z.string().nullable(),
  assets: z.array(z.object({ name: z.string(), digest: z.string().nullable() })),
});

const snapshotSchema = z.object({ sha: releaseShaSchema, release: releaseSchema });

function validateSnapshot(identity: ReleaseIdentity, input: unknown) {
  const snapshot = snapshotSchema.parse(input);
  if (
    snapshot.sha !== identity.sha ||
    snapshot.release.tag_name !== identity.tag ||
    (identity.releaseId !== undefined && snapshot.release.id !== identity.releaseId)
  ) {
    throw new Error('Release candidate rejected the GitHub tag identity.');
  }
  return snapshot;
}

export function readReleaseSnapshot(identity: ReleaseIdentity, github: ReleaseGitHub) {
  return validateSnapshot(identity, {
    sha: resolveReleaseTag(identity.tag, github),
    release: github.get(
      identity.releaseId === undefined
        ? `releases/tags/${encodeURIComponent(identity.tag)}`
        : `releases/${identity.releaseId}`,
    ),
  });
}

export function verifyCandidateSnapshot(
  identity: ReleaseIdentity,
  packages: CheckedPackages,
  input: unknown,
) {
  if (packages.some((item) => item.metadata.version !== identity.version)) {
    throw new Error('Release candidate package versions must match.');
  }
  const { release } = validateSnapshot(identity, input);
  for (const item of packages) {
    const existing = release.assets.find(
      (asset) => asset.name === basename(item.archivePath),
    );
    const expected = 'sha256:' + createHash('sha256').update(item.bytes).digest('hex');
    if (existing && existing.digest !== expected) {
      throw new Error('Release candidate archive conflicts with an existing asset.');
    }
  }
  return release;
}

export function verifyCandidateAssets(
  identity: ReleaseIdentity,
  packages: CheckedPackages,
  github: ReleaseGitHub,
) {
  return verifyCandidateSnapshot(
    identity,
    packages,
    readReleaseSnapshot(identity, github),
  );
}

export async function completeRelease(
  identity: ReleaseIdentity,
  packages: CheckedPackages,
  github: ReleaseGitHub,
  verify: PublicationIO['verify'] = verifyRegistryPublication,
): Promise<void> {
  const release = verifyCandidateAssets(identity, packages, github);
  for (const item of packages) await verify(item.metadata, item.bytes);
  for (const item of packages) {
    if (!release.assets.some((asset) => asset.name === basename(item.archivePath))) {
      github.upload(identity.tag, item.archivePath);
    }
  }
  const confirmed = verifyCandidateAssets(identity, packages, github);
  if (
    packages.some(
      (item) =>
        !confirmed.assets.some((asset) => asset.name === basename(item.archivePath)),
    )
  ) {
    throw new Error('GitHub release archives are not confirmed.');
  }
  github.patch(`releases/${release.id}`, {
    draft: false,
    make_latest: 'true',
    body: (release.body ?? '').replace(
      'npm publication is pending.',
      'both npm packages are published and verified.',
    ),
  });
}
