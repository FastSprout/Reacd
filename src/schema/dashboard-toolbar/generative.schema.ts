import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { dashboardToolbarSchema } from './dashboard-toolbar.schema.js';

export interface DashboardToolbarNode<Content> extends Omit<
  z.infer<typeof dashboardToolbarSchema>,
  'children' | 'start' | 'end'
> {
  type: 'DashboardToolbar';
  children: Content[];
  start?: Content[] | undefined;
  end?: Content[] | undefined;
}

export function dashboardToolbarNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...dashboardToolbarSchema.shape,
    type: z.literal('DashboardToolbar'),
    children: slot,
    start: slot.optional(),
    end: slot.optional(),
  });
}
