import { parse } from 'yaml';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { SiteNavigation } from '../content/model.js';
import { siteOriginSchema } from '../content/model.schema.js';

type NavigationInput = Record<string, string | NavigationInput[]>;
const navigationSchema: z.ZodType<NavigationInput> = z
  .record(
    z.string().min(1),
    z.union([z.string(), z.array(z.lazy(() => navigationSchema)).min(1)]),
  )
  .refine((entry) => Object.keys(entry).length === 1);
const configurationSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  origin: siteOriginSchema,
  navigation: z.array(navigationSchema).min(1),
});

export function pageRoute(sourcePath: string): string {
  if (
    !/^[a-z0-9][a-z0-9/_-]*\.md$/.test(sourcePath) ||
    sourcePath.split('/').includes('..')
  ) {
    throw new Error(`Invalid documentation path: ${sourcePath}`);
  }
  const base = sourcePath.replace(/(?:^|\/)index\.md$/, '').replace(/\.md$/, '');
  return base ? `/${base}/` : '/';
}

function navigation(
  entries: NavigationInput[],
  parents: readonly string[],
): SiteNavigation[] {
  return entries.flatMap((entry) =>
    Object.entries(entry).map(([label, value]) => {
      const identity =
        typeof value === 'string' ? value : JSON.stringify([...parents, label]);
      const digest = createHash('sha256').update(identity).digest('hex');
      return typeof value === 'string'
        ? { key: `page-${digest}`, label, href: pageRoute(value) }
        : {
            key: `group-${digest}`,
            label,
            children: navigation(value, [...parents, label]),
          };
    }),
  );
}

export function readSiteConfig(source: string) {
  const data: unknown = parse(source);
  const config = configurationSchema.parse(data);
  return {
    origin: config.origin,
    title: config.title,
    description: config.description,
    navigation: navigation(config.navigation, []),
  };
}
