import { z } from 'zod';
import { dashboardSidebarCollapseSchema } from './dashboard-sidebar-collapse.schema.js';

export const dashboardSidebarCollapseNodeSchema = z.strictObject({
  ...dashboardSidebarCollapseSchema.shape,
  type: z.literal('DashboardSidebarCollapse'),
});
