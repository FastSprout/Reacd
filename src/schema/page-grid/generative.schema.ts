import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageGridSchema } from './page-grid.schema.js';

export interface PageGridNode<Content> extends Omit<
  z.infer<typeof pageGridSchema>,
  'children'
> {
  type: 'PageGrid';
  children: Content[];
}

export function pageGridNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageGridSchema.shape,
    type: z.literal('PageGrid'),
    children: slot,
  });
}
