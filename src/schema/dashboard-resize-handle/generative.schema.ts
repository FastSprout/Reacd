import { z } from 'zod';
import { dashboardResizeHandleSchema } from './dashboard-resize-handle.schema.js';

export const dashboardResizeHandleNodeSchema = z.strictObject({
  ...dashboardResizeHandleSchema.shape,
  type: z.literal('DashboardResizeHandle'),
});
