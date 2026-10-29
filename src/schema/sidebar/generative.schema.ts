import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { sidebarSchema } from './sidebar.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

export interface SidebarNode<Content> extends Omit<
  z.infer<typeof sidebarSchema>,
  | 'children'
  | 'header'
  | 'footer'
  | 'actions'
  | 'collapsedContent'
  | 'open'
  | 'onOpenChange'
  | 'mobileOpen'
  | 'onMobileOpenChange'
> {
  type: 'Sidebar';
  open: z.infer<typeof writeStateBindingSchema>;
  mobileOpen: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  actions?: Content[] | undefined;
  collapsedContent?: Content[] | undefined;
}

export function sidebarNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const {
    onOpenChange: _open,
    onMobileOpenChange: _mobile,
    ...shape
  } = sidebarSchema.shape;
  return z.strictObject({
    ...shape,
    type: z.literal('Sidebar'),
    open: writeStateBindingSchema,
    mobileOpen: writeStateBindingSchema,
    children: slot,
    header: slot.optional(),
    footer: slot.optional(),
    actions: slot.optional(),
    collapsedContent: slot.optional(),
  });
}
