import { z } from 'zod';
import { labelSchema } from '../shared/values.js';

export const dashboardSidebarCollapseSchema = z.strictObject({
  label: labelSchema.optional(),
  disabled: z.boolean().optional(),
});
