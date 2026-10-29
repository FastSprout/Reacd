import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { dashboardPanelSchema } from './dashboard-panel.schema.js';

export interface DashboardPanelNode<Content> extends Omit<
  z.infer<typeof dashboardPanelSchema>,
  'children' | 'header' | 'footer'
> {
  type: 'DashboardPanel';
  children: Content[];
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
}

export function dashboardPanelNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...dashboardPanelSchema.shape,
    type: z.literal('DashboardPanel'),
    children: slot,
    header: slot.optional(),
    footer: slot.optional(),
  });
}
