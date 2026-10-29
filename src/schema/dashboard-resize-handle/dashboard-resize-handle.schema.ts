import { z } from 'zod';
import { labelSchema } from '../shared/values.js';

export const dashboardResizeHandleSchema = z.strictObject({
  label: labelSchema.optional(),
  disabled: z.boolean().optional(),
});
