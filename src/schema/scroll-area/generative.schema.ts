import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { scrollAreaSchema } from './scroll-area.schema.js';

export interface ScrollAreaNode<Content> extends Omit<
  z.infer<typeof scrollAreaSchema>,
  'children'
> {
  type: 'ScrollArea';
  children: Content[];
}
export function scrollAreaNodeSchema<Content>(content: z.ZodType<Content>) {
  return z.strictObject({
    ...scrollAreaSchema.shape,
    type: z.literal('ScrollArea'),
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}
