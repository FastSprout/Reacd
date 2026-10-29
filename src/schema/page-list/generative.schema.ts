import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageListSchema } from './page-list.schema.js';

export interface PageListNode<Content> extends Omit<
  z.infer<typeof pageListSchema>,
  'children'
> {
  type: 'PageList';
  children: Content[];
}

export function pageListNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageListSchema.shape,
    type: z.literal('PageList'),
    children: slot,
  });
}
