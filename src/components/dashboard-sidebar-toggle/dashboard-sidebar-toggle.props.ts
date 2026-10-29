import type { z } from 'zod';
import type { dashboardSidebarToggleSchema } from
  '../../schema/dashboard-sidebar-toggle/dashboard-sidebar-toggle.schema.js';

export type DashboardSidebarToggleProps = z.input<typeof dashboardSidebarToggleSchema>;
