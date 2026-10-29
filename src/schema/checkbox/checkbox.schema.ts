import { z } from 'zod';
import { booleanChangeSchema, labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const checkboxSchema = z.strictObject({
  label: labelSchema,
  checked: z.boolean(),
  onCheckedChange: booleanChangeSchema,
  indeterminate: z.boolean().optional(),
  description: textSchema.optional(),
  name: stateKeySchema.optional(),
  value: textSchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
});
