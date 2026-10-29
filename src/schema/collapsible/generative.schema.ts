import { z } from 'zod';
import { collapsibleSchema } from './collapsible.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface CollapsibleNode<Content> extends Omit<
  z.infer<typeof collapsibleSchema>,
  'children' | 'open' | 'onOpenChange'
> {
  type: 'Collapsible';
  open: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
}
export function collapsibleNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = collapsibleSchema.shape;
  return z.strictObject({
    ...properties,
    type: z.literal('Collapsible'),
    open: writeStateBindingSchema,
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}
