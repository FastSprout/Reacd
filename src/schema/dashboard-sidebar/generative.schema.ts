import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { dashboardSidebarSchema } from './dashboard-sidebar.schema.js';

export interface DashboardSidebarNode<Content> extends Omit<
  z.infer<typeof dashboardSidebarSchema>,
  'children' | 'header' | 'footer' | 'actions' | 'collapsedContent'
> {
  type: 'DashboardSidebar';
  children: Content[];
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  actions?: Content[] | undefined;
  collapsedContent?: Content[] | undefined;
}

export function dashboardSidebarNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...dashboardSidebarSchema.shape,
    type: z.literal('DashboardSidebar'),
    children: slot,
    header: slot.optional(),
    footer: slot.optional(),
    actions: slot.optional(),
    collapsedContent: slot.optional(),
  });
}
