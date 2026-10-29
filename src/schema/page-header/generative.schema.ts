import { validPageAnchor } from '../shared/identifier.js';
import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageHeaderSchema } from './page-header.schema.js';

export interface PageHeaderNode<Content> extends Omit<
  z.infer<typeof pageHeaderSchema>,
  'children' | 'links'
> {
  type: 'PageHeader';
  children: Content[];
  links?: Content[] | undefined;
}

export function pageHeaderNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const shape = pageHeaderSchema.shape;
  return z
    .strictObject({
      ...shape,
      type: z.literal('PageHeader'),
      children: slot,
      links: slot.optional(),
    })
    .refine(validPageAnchor, 'An anchor requires a named title.');
}
