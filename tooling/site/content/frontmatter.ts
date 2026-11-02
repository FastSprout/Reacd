import { parse } from 'yaml';
import { z } from 'zod';
import { COMPONENT_NAMES } from '@fastsprout/reacd';
import { RECIPE_NAMES } from '../previews/recipe-names.js';
import type { SiteSection } from './model.js';

const metadataSchema = z
  .strictObject({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    reacd_preview: z.enum(COMPONENT_NAMES).optional(),
    reacd_example: z.enum(RECIPE_NAMES).optional(),
  })
  .refine((data) => !(data.reacd_preview && data.reacd_example));

export interface Frontmatter {
  readonly title?: string;
  readonly description?: string;
  readonly preview?: Omit<Extract<SiteSection, { type: 'preview' }>, 'key'>;
  readonly content: string;
}

export function readFrontmatter(source: string): Frontmatter {
  if (!source.startsWith('---\n')) return { content: source };
  const end = source.indexOf('\n---\n', 4);
  if (end < 0) throw new Error('Unterminated documentation frontmatter');
  const data: unknown = parse(source.slice(4, end));
  const metadata = metadataSchema.parse(data);
  const preview: Frontmatter['preview'] = metadata.reacd_preview
    ? { type: 'preview', component: metadata.reacd_preview }
    : metadata.reacd_example
      ? { type: 'preview', example: metadata.reacd_example }
      : undefined;
  return {
    ...(metadata.title ? { title: metadata.title } : {}),
    ...(metadata.description ? { description: metadata.description } : {}),
    ...(preview ? { preview } : {}),
    content: source.slice(end + 5),
  };
}
