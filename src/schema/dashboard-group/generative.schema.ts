import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';
import { validPanelRange } from '../../core/splitter.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import {
  dashboardGroupSchema,
  dashboardRegionSchema,
  validDashboardRegions,
} from './dashboard-group.schema.js';

export interface DashboardGroupNode<Content> extends Omit<
  z.infer<typeof dashboardGroupSchema>,
  | 'regions'
  | 'value'
  | 'onValueChange'
  | 'open'
  | 'onOpenChange'
  | 'mobileOpen'
  | 'onMobileOpenChange'
  | 'children'
> {
  type: 'DashboardGroup';
  regions: readonly (Omit<z.infer<typeof dashboardRegionSchema>, 'content'> & {
    content: Content[];
  })[];
  value: z.infer<typeof writeStateBindingSchema>;
  open: z.infer<typeof writeStateBindingSchema>;
  mobileOpen: z.infer<typeof writeStateBindingSchema>;
  children: Content[];
}

export function dashboardGroupNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const {
    onValueChange: _value,
    onOpenChange: _open,
    onMobileOpenChange: _mobile,
    ...shape
  } = dashboardGroupSchema.shape;
  return z
    .strictObject({
      ...shape,
      type: z.literal('DashboardGroup'),
      regions: z
        .array(
          z
            .strictObject({
              ...dashboardRegionSchema.shape,
              content: slot,
            })
            .refine(validPanelRange, 'A region minimum cannot exceed its maximum.'),
        )
        .min(SPLITTER_POLICY.minPanels)
        .max(SPLITTER_POLICY.maxPanels)
        .refine(validDashboardRegions, 'Dashboard region identity/roles are invalid.')
        .readonly(),
      value: writeStateBindingSchema,
      open: writeStateBindingSchema,
      mobileOpen: writeStateBindingSchema,
      children: slot,
    })
    .refine((node) => node.open.state !== node.mobileOpen.state, {
      path: ['mobileOpen'],
      message: 'Desktop and mobile state keys must differ.',
    });
}
