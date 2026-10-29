import type { z } from 'zod';
import type { dashboardSidebarSchema } from
  '../../schema/dashboard-sidebar/dashboard-sidebar.schema.js';

export type DashboardSidebarProps = z.input<typeof dashboardSidebarSchema>;
