import type {
  PackageMetadata,
  PublicationMetadata,
  ShadcnPublicationMetadata,
} from './metadata.js';
import { REGISTRY_VERIFICATION_POLICY } from './registry.js';
import type { verifyRegistryPublication } from './registry.js';

export const PUBLICATION_STATUS_POLICY = { missing: 404, existing: 200 } as const;

export interface CheckedPublication<
  Metadata extends PackageMetadata = PackageMetadata,
> {
  readonly metadata: Metadata;
  readonly archivePath: string;
  readonly bytes: Uint8Array;
}
export type CheckedPackages = readonly [
  CheckedPublication<PublicationMetadata>,
  CheckedPublication<ShadcnPublicationMetadata>,
];
export interface PublicationIO {
  readonly lookup: (metadata: PackageMetadata) => Promise<number>;
  readonly upload: (archivePath: string) => Promise<void> | void;
  readonly verify: typeof verifyRegistryPublication;
}

export async function publishCheckedPackages(
  packages: CheckedPackages,
  io: PublicationIO,
): Promise<Awaited<ReturnType<typeof verifyRegistryPublication>>[]> {
  if (packages[0].metadata.version !== packages[1].metadata.version) {
    throw new Error('Checked engine and adapter versions must match.');
  }
  for (const publication of packages) {
    if (
      publication.bytes.byteLength < REGISTRY_VERIFICATION_POLICY.minimumArchiveBytes
    ) {
      throw new Error('Checked release archives must not be empty.');
    }
  }
  const confirmed = [];
  for (const publication of packages) {
    const status = await io.lookup(publication.metadata);
    if (status === PUBLICATION_STATUS_POLICY.missing) {
      await io.upload(publication.archivePath);
    } else if (status !== PUBLICATION_STATUS_POLICY.existing) {
      throw new Error('Public registry lookup did not establish publication state.');
    }
    confirmed.push(await io.verify(publication.metadata, publication.bytes));
  }
  return confirmed;
}
