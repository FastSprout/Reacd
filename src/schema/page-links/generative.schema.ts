import { z } from 'zod';
import { CONTENT_POLICY, DOCUMENT_POLICY } from '../../core/policy.js';
import { pageLinksSchema } from './page-links.schema.js';
import { pageLinkItemSchema, validPageLinkCollection } from '../shared/page-links.js';

export interface PageLinksLinkNode<Content> extends Omit<
  z.infer<typeof pageLinkItemSchema>,
  'leading'
> {
  leading?: Content[] | undefined;
}

export interface PageLinksNode<Content> extends Omit<
  z.infer<typeof pageLinksSchema>,
  'links'
> {
  type: 'PageLinks';
  links?: readonly PageLinksLinkNode<Content>[] | undefined;
}

export function pageLinksNodeSchema<Content>(content: z.ZodType<Content>) {
  const item = z.strictObject({
    ...pageLinkItemSchema.shape,
    leading: z.array(content).max(DOCUMENT_POLICY.maxChildren).optional(),
  });
  return z
    .strictObject({
      ...pageLinksSchema.shape,
      type: z.literal('PageLinks'),
      links: z.array(item).max(CONTENT_POLICY.maxOptions).readonly().optional(),
    })
    .refine(
      validPageLinkCollection,
      'Links need unique keys and an existing active key.',
    );
}
