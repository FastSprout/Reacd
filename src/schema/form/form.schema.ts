import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, pressSchema } from '../shared/values.js';
import { formSummarySchema } from './summary.schema.js';

export const formSchema = z.strictObject({
  children: childrenSchema,
  label: labelSchema,
  onSubmit: pressSchema,
  disabled: z.boolean().optional(),
  submitting: z.boolean().optional(),
  errors: formSummarySchema.optional(),
});
