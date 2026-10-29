import { z } from 'zod';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';

export const contentSearchButtonSchema = z.strictObject({
  label: labelSchema.optional(),
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  disabled: z.boolean().optional(),
});
