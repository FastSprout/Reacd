import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageSchema } from './page.schema.js';

export interface PageNode<Content> extends Omit<
  z.infer<typeof pageSchema>,
  'children' | 'left' | 'right'
> {
  type: 'Page';
  children: Content[];
  left?: Content[] | undefined;
  right?: Content[] | undefined;
}

export function pageNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageSchema.shape,
    type: z.literal('Page'),
    children: slot,
    left: slot.optional(),
    right: slot.optional(),
  });
}
