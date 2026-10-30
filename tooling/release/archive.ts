import { z } from 'zod';
import { PUBLICATION_POLICY } from './policy.js';
import type { PublicationMetadata } from './metadata.js';

export const RELEASE_ARCHIVE_POLICY = {
  required: [
    'package.json',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'README.md',
    'schema/reacd.schema.json',
    'schema/generative.schema.json',
    'dist/index.js',
    'dist/index.d.ts',
    'dist/bootstrap.js',
    'dist/bootstrap.d.ts',
    'dist/renderer/bootstrap/bootstrap.d.ts',
    'dist/generative.js',
    'dist/generative.d.ts',
    'dist/jsx-runtime.js',
    'dist/jsx-runtime.d.ts',
    'dist/jsx-dev-runtime.js',
    'dist/jsx-dev-runtime.d.ts',
    'dist/adapter/shadcn/styles.css',
  ],
  output: '.cache/release/package.tgz',
} as const;

const roots = new Set<string>(RELEASE_ARCHIVE_POLICY.required);
const distPath = new RegExp(
  '^dist/(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9_-]+' +
  '(?:\\.[A-Za-z0-9_-]+)*\\.(?:js|d\\.ts|css)$',
);
const forbidden = /(?:__tests__|test-support|fixtures|specs)\/|\.(?:test|spec)\./;
const packResult = z.tuple([
  z.object({
    name: z.string(),
    version: z.string(),
    filename: z.string(),
    integrity: z.string().regex(/^sha512-[A-Za-z0-9+/]+={0,2}$/),
    files: z.array(z.object({ path: z.string() })),
  }),
]);

export function validateReleaseArchive(input: unknown, meta: PublicationMetadata) {
  const [archive] = packResult.parse(input);
  if (
    archive.name !== meta.name ||
    archive.version !== meta.version ||
    archive.filename !== `${PUBLICATION_POLICY.archiveBasename}-${meta.version}.tgz`
  )
    throw new Error('Packed publication identity does not match its manifest.');
  const paths = archive.files.map((file) => file.path);
  if (new Set(paths).size !== paths.length) {
    throw new Error('Packed publication contains duplicate paths.');
  }
  for (const path of paths) {
    if (roots.has(path)) continue;
    if (!distPath.test(path) || forbidden.test(path)) {
      throw new Error(`Forbidden publication file: ${path}`);
    }
  }
  for (const path of RELEASE_ARCHIVE_POLICY.required) {
    if (!paths.includes(path)) throw new Error(`Missing publication file: ${path}`);
  }
  return archive;
}
