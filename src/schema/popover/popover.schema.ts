import { z } from 'zod';
import {
  POPOVER_PLACEMENTS,
  POPOVER_ALIGNMENTS,
  POPOVER_MODES,
  POPOVER_TIMINGS,
} from '../../core/popover-policy.js';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';
export const popoverSchema = z.strictObject({
  title: labelSchema,
  triggerLabel: labelSchema,
  description: labelSchema.optional(),
  closeLabel: labelSchema.optional(),
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  children: childrenSchema,
  footer: childrenSchema,
  placement: z.enum(POPOVER_PLACEMENTS).optional(),
  align: z.enum(POPOVER_ALIGNMENTS).optional(),
  arrow: z.boolean().optional(),
  modal: z.boolean().optional(),
  dismissible: z.boolean().optional(),
  retainContent: z.boolean().optional(),
  disabled: z.boolean().optional(),
  mode: z.enum(POPOVER_MODES).optional(),
  openDelay: z.enum(POPOVER_TIMINGS).optional(),
  closeDelay: z.enum(POPOVER_TIMINGS).optional(),
});
