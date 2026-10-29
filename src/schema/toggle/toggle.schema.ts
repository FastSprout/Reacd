import { z } from 'zod';
import { booleanChangeSchema, disabledSchema, labelSchema } from '../shared/values.js';

export const toggleSchema = z.strictObject({
  label: labelSchema,
  checked: z.boolean(),
  onCheckedChange: booleanChangeSchema,
  disabled: disabledSchema,
});
