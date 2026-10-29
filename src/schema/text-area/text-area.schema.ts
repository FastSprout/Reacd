import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import {
  disabledSchema,
  labelSchema,
  textSchema,
  textChangeSchema,
} from '../shared/values.js';

export const textAreaSchema = z.strictObject({
  label: labelSchema,
  value: textSchema,
  onValueChange: textChangeSchema,
  placeholder: textSchema.optional(),
  required: z.boolean().optional(),
  disabled: disabledSchema,
  rows: z
    .number()
    .int()
    .min(CONTENT_POLICY.minTextAreaRows)
    .max(CONTENT_POLICY.maxTextAreaRows)
    .optional(),
});
