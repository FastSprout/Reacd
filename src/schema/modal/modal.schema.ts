import { z } from 'zod';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const modalSchema = z.strictObject({
  title: labelSchema,
  description: labelSchema,
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  triggerLabel: labelSchema.optional(),
  closeLabel: labelSchema.optional(),
  children: childrenSchema,
  footer: childrenSchema,
  disabled: z.boolean().optional(),
  dismissible: z.boolean().optional(),
  modal: z.boolean().optional(),
  overlay: z.boolean().optional(),
  fullscreen: z.boolean().optional(),
  retainContent: z.boolean().optional(),
});
