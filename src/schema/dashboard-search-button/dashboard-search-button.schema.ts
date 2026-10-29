import { z } from 'zod';
import { labelSchema, pressSchema } from '../shared/values.js';

export const dashboardSearchButtonSchema = z.strictObject({
  label: labelSchema.optional(),
  onPress: pressSchema,
  disabled: z.boolean().optional(),
});
