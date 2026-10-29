import { z } from 'zod';
import {
  DASHBOARD_REGION_KINDS,
  DASHBOARD_COLLAPSE_MODES,
} from '../../core/dashboard-policy.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';
import { validPanelRange } from '../../core/splitter.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import {
  splitterPanelSchema,
  splitterSchema,
  panelLayoutSchemaFor,
} from '../splitter/splitter.schema.js';
import { panelLayoutValueSchema } from '../state/panel-layout/index.js';

const { collapsedShare: _collapsed, ...panelShape } = splitterPanelSchema.shape;
export const dashboardRegionSchema = z
  .strictObject({
    ...panelShape,
    kind: z.enum(DASHBOARD_REGION_KINDS),
  })
  .refine(validPanelRange, 'A region minimum cannot exceed its maximum.');

export function validDashboardRegions(
  regions: readonly {
    id: string;
    kind: 'sidebar' | 'panel';
  }[],
): boolean {
  return (
    new Set(regions.map((region) => region.id)).size === regions.length &&
    regions.filter((region) => region.kind === 'sidebar').length === 1 &&
    regions.some((region) => region.kind === 'panel')
  );
}

export const dashboardRegionsSchema = z
  .array(dashboardRegionSchema)
  .min(SPLITTER_POLICY.minPanels)
  .max(SPLITTER_POLICY.maxPanels)
  .refine(
    validDashboardRegions,
    'Dashboard regions require unique IDs, one sidebar and at least one panel.',
  )
  .readonly();

export const dashboardGroupSchema = z
  .strictObject({
    label: labelSchema,
    regions: dashboardRegionsSchema,
    value: panelLayoutValueSchema,
    onValueChange: splitterSchema.shape.onValueChange,
    open: z.boolean(),
    onOpenChange: booleanChangeSchema,
    mobileOpen: z.boolean(),
    onMobileOpenChange: booleanChangeSchema,
    collapseMode: z.enum(DASHBOARD_COLLAPSE_MODES).optional(),
    disabled: z.boolean().optional(),
    resizeLabel: labelSchema.optional(),
    children: childrenSchema,
  })
  .superRefine((properties, context) => {
    if (!panelLayoutSchemaFor(properties.regions).safeParse(properties.value).success)
      context.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Dashboard shares must match expanded region constraints.',
      });
  });
