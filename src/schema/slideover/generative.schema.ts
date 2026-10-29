import { z } from 'zod';
import { slideoverSchema } from './slideover.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface SlideoverNode<Content> extends Omit<
  z.infer<typeof slideoverSchema>,
  'children' | 'footer' | 'open' | 'onOpenChange'
> {
  type: 'Slideover';
  open: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
  footer?: Content[] | undefined;
}
export function slideoverNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = slideoverSchema.shape;
  const nodes = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...properties,
    type: z.literal('Slideover'),
    open: writeStateBindingSchema,
    children: nodes,
    footer: nodes.optional(),
  });
}
