import { z } from 'zod';
import { modalSchema } from './modal.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface ModalNode<Content> extends Omit<
  z.infer<typeof modalSchema>,
  'children' | 'footer' | 'open' | 'onOpenChange'
> {
  type: 'Modal';
  open: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
  footer?: Content[] | undefined;
}
export function modalNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = modalSchema.shape;
  const nodes = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...properties,
    type: z.literal('Modal'),
    open: writeStateBindingSchema,
    children: nodes,
    footer: nodes.optional(),
  });
}
