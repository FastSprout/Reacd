import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { dashboardNavbarSchema } from './dashboard-navbar.schema.js';

export interface DashboardNavbarNode<Content> extends Omit<
  z.infer<typeof dashboardNavbarSchema>,
  'children' | 'leading' | 'trailing' | 'start' | 'end'
> {
  type: 'DashboardNavbar';
  children: Content[];
  leading?: Content[] | undefined;
  trailing?: Content[] | undefined;
  start?: Content[] | undefined;
  end?: Content[] | undefined;
}

export function dashboardNavbarNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...dashboardNavbarSchema.shape,
    type: z.literal('DashboardNavbar'),
    children: slot,
    leading: slot.optional(),
    trailing: slot.optional(),
    start: slot.optional(),
    end: slot.optional(),
  });
}
