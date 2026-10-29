import type { z } from 'zod';
import type { dashboardSearchSchema } from
  '../../schema/dashboard-search/dashboard-search.schema.js';

export type DashboardSearchProps = z.input<typeof dashboardSearchSchema>;
