import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { contextMenuSchema } from './context-menu.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { menuNodeItemsSchema } from '../action-menu/generative.schema.js';
export interface ContextMenuNode<Content> extends Omit<
  z.infer<typeof contextMenuSchema>,
  'onOpenChange' | 'open' | 'items' | 'children'
> {
  type: 'ContextMenu';
  open: z.infer<typeof writeStateBindingSchema>;
  items: z.infer<typeof menuNodeItemsSchema>;
  children: Content[];
}
export function contextMenuNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onOpenChange: _change, ...properties } = contextMenuSchema.shape;
  return z.strictObject({
    ...properties,
    type: z.literal('ContextMenu'),
    open: writeStateBindingSchema,
    items: menuNodeItemsSchema,
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}
