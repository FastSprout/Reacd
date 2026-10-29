import { z } from 'zod';
import { labelSchema } from '../shared/values.js';

export const dashboardSidebarToggleSchema = z.strictObject({
  label: labelSchema.optional(),
  disabled: z.boolean().optional(),
});
