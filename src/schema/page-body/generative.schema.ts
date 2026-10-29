import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageBodySchema } from './page-body.schema.js';

export interface PageBodyNode<Content> extends Omit<
  z.infer<typeof pageBodySchema>,
  'children'
> {
  type: 'PageBody';
  children: Content[];
}

export function pageBodyNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageBodySchema.shape,
    type: z.literal('PageBody'),
    children: slot,
  });
}
