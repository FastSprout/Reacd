import { z } from 'zod';
import {
  SIDEBAR_SIDES,
  SIDEBAR_VARIANTS,
  SIDEBAR_COLLAPSIBLE,
} from '../../core/sidebar-policy.js';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const sidebarSchema = z.strictObject({
  title: labelSchema,
  description: labelSchema.optional(),
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  mobileOpen: z.boolean(),
  onMobileOpenChange: booleanChangeSchema,
  side: z.enum(SIDEBAR_SIDES).optional(),
  variant: z.enum(SIDEBAR_VARIANTS).optional(),
  collapsible: z.enum(SIDEBAR_COLLAPSIBLE).optional(),
  toggleLabel: labelSchema.optional(),
  closeLabel: labelSchema.optional(),
  disabled: z.boolean().optional(),
  children: childrenSchema,
  header: childrenSchema,
  footer: childrenSchema,
  actions: childrenSchema,
  collapsedContent: childrenSchema,
});
