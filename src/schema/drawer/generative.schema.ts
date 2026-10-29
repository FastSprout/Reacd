import { z } from 'zod';
import { drawerSchema } from './drawer.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';

export interface DrawerNode<Content> extends Omit<
  z.infer<typeof drawerSchema>,
  'children' | 'footer' | 'open' | 'onOpenChange'
> {
  type: 'Drawer';
  open: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
  footer?: Content[] | undefined;
}
export function drawerNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = drawerSchema.shape;
  const nodes = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...properties,
    type: z.literal('Drawer'),
    open: writeStateBindingSchema,
    children: nodes,
    footer: nodes.optional(),
  });
}
