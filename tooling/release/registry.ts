import { createHash } from 'node:crypto';
import { z } from 'zod';
import { isReleaseVersion, PUBLICATION_POLICY } from './policy.js';

export interface RegistryPublicationIdentity {
  readonly name: string;
  readonly version: string;
}

export const REGISTRY_VERIFICATION_POLICY = {
  attempts: 6,
  delayMs: 5_000,
  requestTimeoutMs: 15_000,
  minimumArchiveBytes: 1,
} as const;

export interface RegistryResponse {
  readonly status: number;
  json: () => Promise<unknown>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export type RegistryFetch = (
  url: string,
  options: RequestInit,
) => Promise<RegistryResponse>;

export interface RegistryIO {
  readonly fetch: RegistryFetch;
  readonly sleep: (delay: number) => Promise<void>;
}

const DEFAULT_IO: RegistryIO = {
  fetch: (url, options) => fetch(url, options),
  sleep: (delay) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    }),
};

const publishedVersionSchema = z.object({
  name: z.string().min(1),
  version: z.string().refine(isReleaseVersion),
  dist: z.object({
    integrity: z.string().regex(/^sha512-[A-Za-z0-9+/]{86}==$/),
    tarball: z.string().url(),
  }),
});

function digest(bytes: Uint8Array): string {
  return 'sha512-' + createHash('sha512').update(bytes).digest('base64');
}

function publicTarball(value: string): boolean {
  const url = new URL(value);
  return (
    url.origin === new URL(PUBLICATION_POLICY.registry).origin &&
    url.username === '' &&
    url.password === '' &&
    url.search === '' &&
    url.hash === ''
  );
}

function request(io: RegistryIO, url: string, accept: string) {
  return io.fetch(url, {
    headers: { Accept: accept },
    credentials: 'omit',
    redirect: 'error',
    cache: 'no-store',
    signal: AbortSignal.timeout(REGISTRY_VERIFICATION_POLICY.requestTimeoutMs),
  });
}

function versionEndpoint(metadata: RegistryPublicationIdentity): string {
  return new URL(
    `${encodeURIComponent(metadata.name)}/${encodeURIComponent(metadata.version)}`,
    PUBLICATION_POLICY.registry,
  ).href;
}

export async function lookupRegistryPublication(
  metadata: RegistryPublicationIdentity,
  registryFetch: RegistryFetch = DEFAULT_IO.fetch,
): Promise<number> {
  const response = await request(
    { ...DEFAULT_IO, fetch: registryFetch },
    versionEndpoint(metadata),
    'application/json',
  );
  return response.status;
}

async function confirmsPublication(
  metadata: RegistryPublicationIdentity,
  archive: Uint8Array,
  integrity: string,
  io: RegistryIO,
): Promise<boolean> {
  const response = await request(io, versionEndpoint(metadata), 'application/json');
  if (response.status !== 200) return false;
  const input: unknown = await response.json();
  const parsed = publishedVersionSchema.safeParse(input);
  if (!parsed.success) return false;
  const published = parsed.data;
  if (
    published.name !== metadata.name ||
    published.version !== metadata.version ||
    published.dist.integrity !== integrity ||
    !publicTarball(published.dist.tarball)
  )
    return false;
  const tarball = await request(io, published.dist.tarball, 'application/octet-stream');
  if (tarball.status !== 200) return false;
  const bytes = new Uint8Array(await tarball.arrayBuffer());
  return bytes.byteLength === archive.byteLength && digest(bytes) === integrity;
}

export async function verifyRegistryPublication(
  metadata: RegistryPublicationIdentity,
  archive: Uint8Array,
  io: RegistryIO = DEFAULT_IO,
): Promise<{ name: string; version: string; integrity: string }> {
  if (archive.byteLength < REGISTRY_VERIFICATION_POLICY.minimumArchiveBytes) {
    throw new Error('Checked release archive must not be empty.');
  }
  const integrity = digest(archive);
  for (let attempt = 0; attempt < REGISTRY_VERIFICATION_POLICY.attempts; attempt++) {
    try {
      if (await confirmsPublication(metadata, archive, integrity, io)) {
        return { name: metadata.name, version: metadata.version, integrity };
      }
    } catch {
      // Registry propagation and transport failures share the same bounded retry.
    }
    if (attempt + 1 < REGISTRY_VERIFICATION_POLICY.attempts) {
      await io.sleep(REGISTRY_VERIFICATION_POLICY.delayMs);
    }
  }
  throw new Error(
    'Public registry did not confirm the exact checked archive within ' +
      `${REGISTRY_VERIFICATION_POLICY.attempts} attempts.`,
  );
}
