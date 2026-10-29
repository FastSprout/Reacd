import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageColumnsSchema } from './page-columns.schema.js';

export interface PageColumnsNode<Content> extends Omit<
  z.infer<typeof pageColumnsSchema>,
  'children'
> {
  type: 'PageColumns';
  children: Content[];
}

export function pageColumnsNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageColumnsSchema.shape,
    type: z.literal('PageColumns'),
    children: slot,
  });
}
