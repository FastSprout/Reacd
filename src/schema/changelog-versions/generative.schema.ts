import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { changelogVersionsSchema } from './changelog-versions.schema.js';
import { changelogVersionNodeSchema } from '../changelog-version/generative.schema.js';
import type { ChangelogVersionNode } from '../changelog-version/generative.schema.js';
import { identifierSchema } from '../shared/identifier.js';
import { uniqueEditorialKeys, validEditorialEntry } from '../shared/editorial.js';

export interface ChangelogVersionsNode<Content> extends Omit<
  z.infer<typeof changelogVersionsSchema>,
  'versions' | 'children'
> {
  type: 'ChangelogVersions';
  versions?:
    | readonly (Omit<ChangelogVersionNode<Content>, 'type'> & { key: string })[]
    | undefined;
  children: Content[];
}

export function changelogVersionsNodeSchema<Content>(content: z.ZodType<Content>) {
  const { type: _type, ...entry } = changelogVersionNodeSchema(content).shape;
  const item = z
    .strictObject({ ...entry, key: identifierSchema })
    .refine(validEditorialEntry, 'Provide a named target and dated label.');
  return z.strictObject({
    ...changelogVersionsSchema.shape,
    type: z.literal('ChangelogVersions'),
    versions: z
      .array(item)
      .max(DOCUMENT_POLICY.maxChildren)
      .refine(uniqueEditorialKeys, 'Editorial keys must be unique.')
      .readonly()
      .optional(),
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
    indicator: z.boolean().optional(),
  });
}
