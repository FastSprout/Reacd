import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { popoverSchema } from './popover.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
export interface PopoverNode<Content> extends Omit<
  z.infer<typeof popoverSchema>,
  'open' | 'onOpenChange' | 'children' | 'footer'
> {
  type: 'Popover';
  open: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
  footer?: Content[] | undefined;
}
export function popoverNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = popoverSchema.shape;
  return z.strictObject({
    ...properties,
    type: z.literal('Popover'),
    open: writeStateBindingSchema,
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
    footer: z.array(content).max(DOCUMENT_POLICY.maxChildren).optional(),
  });
}
