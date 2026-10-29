import { z } from 'zod';
import { CONTENT_POLICY, DOCUMENT_POLICY } from '../../core/policy.js';
import { pageAnchorsSchema } from './page-anchors.schema.js';
import { pageLinkItemSchema, validPageLinkCollection } from '../shared/page-links.js';

export interface PageAnchorsLinkNode<Content> extends Omit<
  z.infer<typeof pageLinkItemSchema>,
  'leading'
> {
  leading?: Content[] | undefined;
}

export interface PageAnchorsNode<Content> extends Omit<
  z.infer<typeof pageAnchorsSchema>,
  'links'
> {
  type: 'PageAnchors';
  links?: readonly PageAnchorsLinkNode<Content>[] | undefined;
}

export function pageAnchorsNodeSchema<Content>(content: z.ZodType<Content>) {
  const item = z.strictObject({
    ...pageLinkItemSchema.shape,
    leading: z.array(content).max(DOCUMENT_POLICY.maxChildren).optional(),
  });
  return z
    .strictObject({
      ...pageAnchorsSchema.shape,
      type: z.literal('PageAnchors'),
      links: z.array(item).max(CONTENT_POLICY.maxOptions).readonly().optional(),
    })
    .refine(
      validPageLinkCollection,
      'Links need unique keys and an existing active key.',
    );
}
