import { z } from 'zod';
import { labelSchema, textSchema, booleanChangeSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const switchSchema = z.strictObject({
  label: labelSchema,
  description: textSchema.optional(),
  checked: z.boolean(),
  onCheckedChange: booleanChangeSchema,
  name: stateKeySchema.optional(),
  value: textSchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  loading: z.boolean().optional(),
});
