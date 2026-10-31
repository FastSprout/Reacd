import { z } from 'zod';
import { isReleaseVersion, PUBLICATION_POLICY } from './policy.js';
import {
  parsePublicationManifest,
  parseShadcnPublicationManifest,
} from './metadata.js';
import { isDeepStrictEqual } from 'node:util';
import { SHADCN_PUBLICATION_POLICY } from './policy.js';
import type { PublicationPolicy } from './policy.js';

const asset = z
  .string()
  .regex(/^\.\/(?:dist|schema)\/[A-Za-z0-9_.*/-]+$/)
  .refine((value) => !value.split('/').includes('..'));
const target = z.union([asset, z.strictObject({ types: asset, import: asset })]);
function distributionSchema(policy: PublicationPolicy) {
  const dependencies = z
    .record(z.string(), z.string().refine(isReleaseVersion))
    .refine((values) =>
      [...Object.keys(policy.peers), PUBLICATION_POLICY.name].every(
        (key) => !(key in values),
      ),
    );
  return z
    .strictObject({
      name: z.literal(policy.name),
      version: z.string().refine(isReleaseVersion),
      private: z.literal(false),
      type: z.literal('module'),
      description: z.string().min(1),
      license: z.literal('Apache-2.0'),
      files: z
        .array(z.enum(policy.files))
        .length(policy.files.length)
        .refine((values) => new Set(values).size === values.length),
      exports: z.record(z.enum(policy.exportKeys), target),
      dependencies: dependencies.default({}),
      peerDependencies: z.record(z.string(), z.string()),
      engines: z.strictObject({ node: z.literal(policy.node) }),
      repository: z.strictObject({
        type: z.literal('git'),
        url: z.literal(policy.repository),
      }),
      homepage: z.literal(policy.homepage),
      bugs: z.strictObject({ url: z.literal(policy.issues) }),
      publishConfig: z.strictObject({
        access: z.literal('public'),
        registry: z.literal(policy.registry),
      }),
    })
    .refine((value) =>
      isDeepStrictEqual(
        value.peerDependencies,
        policy.name === SHADCN_PUBLICATION_POLICY.name
          ? { ...policy.peers, '@fastsprout/reacd': value.version }
          : policy.peers,
      ),
    );
}
const schema = distributionSchema(PUBLICATION_POLICY);
const adapterSchema = distributionSchema(SHADCN_PUBLICATION_POLICY);
export type DistributionManifest = z.infer<typeof schema>;

export function createDistributionManifest(input: unknown): DistributionManifest {
  parsePublicationManifest(input);
  return schema.parse(z.object(schema.shape).parse(input));
}

export function parseDistributionManifest(input: unknown): DistributionManifest {
  return schema.parse(input);
}

export function createShadcnDistributionManifest(input: unknown) {
  parseShadcnPublicationManifest(input);
  return adapterSchema.parse(z.object(adapterSchema.shape).parse(input));
}
export function parseShadcnDistributionManifest(input: unknown) {
  return adapterSchema.parse(input);
}
