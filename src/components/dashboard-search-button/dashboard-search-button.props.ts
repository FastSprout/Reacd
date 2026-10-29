import type { z } from 'zod';
import type { dashboardSearchButtonSchema } from
  '../../schema/dashboard-search-button/dashboard-search-button.schema.js';

export type DashboardSearchButtonProps = z.input<typeof dashboardSearchButtonSchema>;
