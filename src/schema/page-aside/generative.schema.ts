import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pageAsideSchema } from './page-aside.schema.js';

export interface PageAsideNode<Content> extends Omit<
  z.infer<typeof pageAsideSchema>,
  'children' | 'top' | 'bottom'
> {
  type: 'PageAside';
  children: Content[];
  top?: Content[] | undefined;
  bottom?: Content[] | undefined;
}

export function pageAsideNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...pageAsideSchema.shape,
    type: z.literal('PageAside'),
    children: slot,
    top: slot.optional(),
    bottom: slot.optional(),
  });
}
