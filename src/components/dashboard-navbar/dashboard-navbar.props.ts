import type { z } from 'zod';
import type { dashboardNavbarSchema } from
  '../../schema/dashboard-navbar/dashboard-navbar.schema.js';

export type DashboardNavbarProps = z.input<typeof dashboardNavbarSchema>;
