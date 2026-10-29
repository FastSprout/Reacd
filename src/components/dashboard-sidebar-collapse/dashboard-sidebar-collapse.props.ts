import type { z } from 'zod';
import type { dashboardSidebarCollapseSchema } from
  '../../schema/dashboard-sidebar-collapse/dashboard-sidebar-collapse.schema.js';

export type DashboardSidebarCollapseProps = z.input<
  typeof dashboardSidebarCollapseSchema
>;
