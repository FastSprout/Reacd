import { z } from 'zod';
import { dashboardSidebarToggleSchema } from './dashboard-sidebar-toggle.schema.js';

export const dashboardSidebarToggleNodeSchema = z.strictObject({
  ...dashboardSidebarToggleSchema.shape,
  type: z.literal('DashboardSidebarToggle'),
});
