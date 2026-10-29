import { z } from 'zod';
import { Children } from 'react';
import {
  TOOLTIP_TIMINGS,
  TOOLTIP_PLACEMENTS,
  TOOLTIP_POLICY,
} from '../../core/tooltip-policy.js';
import { childrenSchema } from '../shared/children.js';
import { booleanChangeSchema, labelSchema } from '../shared/values.js';

export const tooltipProperties = {
  text: labelSchema,
  children: childrenSchema
    .nonoptional()
    .refine(
      (value) => Children.toArray(value).length > 0,
      'Tooltip requires a visible anchor.',
    ),
  placement: z.enum(TOOLTIP_PLACEMENTS).optional(),
  delay: z.enum(TOOLTIP_TIMINGS).optional(),
  arrow: z.boolean().optional(),
  disabled: z.boolean().optional(),
  shortcuts: z
    .array(labelSchema.max(TOOLTIP_POLICY.maxShortcutLength))
    .max(TOOLTIP_POLICY.maxShortcuts)
    .readonly()
    .optional(),
};
export const tooltipSchema = z.union([
  z.strictObject({
    ...tooltipProperties,
    open: z.undefined().optional(),
    onOpenChange: booleanChangeSchema.optional(),
  }),
  z.strictObject({
    ...tooltipProperties,
    open: z.boolean(),
    onOpenChange: booleanChangeSchema,
  }),
]);
