import type { z } from 'zod';
import type { dashboardGroupSchema } from
  '../../schema/dashboard-group/dashboard-group.schema.js';

export type DashboardGroupProps = z.input<typeof dashboardGroupSchema>;
