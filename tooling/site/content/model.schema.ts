import { z } from 'zod';
import { COMPONENT_NAMES } from '@fastsprout/reacd';
import { proseDocumentSchema } from '../../../src/schema/prose/prose.schema.js';
import { RECIPE_NAMES } from '../previews/recipe-names.js';
import type { SiteManifest, SiteNavigation, SitePage } from './model.js';
import { identifierSchema } from '../../../src/schema/shared/identifier.js';
import { contentNavigationItemsSchema } from
  '../../../src/schema/content-outline/items.schema.js';

const nonempty = z.string().min(1);
const route = nonempty.regex(/^\/(?:[a-z0-9][a-z0-9/_-]*\/)?$/);
const id = nonempty.regex(/^[\p{L}\p{N}_][\p{L}\p{N}_.:-]*$/u);
export const siteOriginSchema = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === 'https:' &&
    url.pathname === '/' &&
    !url.search &&
    !url.hash &&
    !url.username &&
    !url.password
  );
});
export const siteNavigationSchema: z.ZodType<SiteNavigation> = z.lazy(() =>
  z.union([
    z.strictObject({ key: identifierSchema, label: nonempty, href: route }),
    z.strictObject({
      key: identifierSchema,
      label: nonempty,
      children: z.array(siteNavigationSchema).min(1),
    }),
  ]),
);
const navigation = z
  .array(siteNavigationSchema)
  .refine(
    (entries) => contentNavigationItemsSchema.safeParse(entries).success,
    'Site navigation must satisfy the closed ContentNavigation contract.',
  );
export const sitePageSchema: z.ZodType<SitePage> = z.strictObject({
  route,
  sourcePath: nonempty.regex(/^[a-z0-9][a-z0-9/_-]*\.md$/),
  title: nonempty,
  titleAnchor: id,
  description: nonempty,
  headings: z.array(
    z.strictObject({
      id,
      title: z.string(),
      level: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]),
    }),
  ),
  sections: z.array(
    z.union([
      z.strictObject({
        type: z.literal('prose'),
        key: nonempty,
        document: proseDocumentSchema,
      }),
      z.strictObject({
        type: z.literal('preview'),
        key: nonempty,
        component: z.enum(COMPONENT_NAMES),
      }),
      z.strictObject({
        type: z.literal('preview'),
        key: nonempty,
        example: z.enum(RECIPE_NAMES),
      }),
    ]),
  ),
  source: z.string(),
});
export const siteManifestSchema: z.ZodType<SiteManifest> = z.strictObject({
  origin: siteOriginSchema,
  title: nonempty,
  description: nonempty,
  navigation,
  pages: z.array(sitePageSchema),
});
export const sitePayloadSchema = z.strictObject({
  origin: siteOriginSchema,
  title: nonempty,
  description: nonempty,
  page: sitePageSchema,
  navigation,
  index: z.array(z.strictObject({ route, title: nonempty, description: nonempty })),
});
