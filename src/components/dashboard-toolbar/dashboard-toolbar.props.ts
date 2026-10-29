import type { z } from 'zod';
import type { dashboardToolbarSchema } from
  '../../schema/dashboard-toolbar/dashboard-toolbar.schema.js';

export type DashboardToolbarProps = z.input<typeof dashboardToolbarSchema>;
