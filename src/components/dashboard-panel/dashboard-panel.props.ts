import type { z } from 'zod';
import type { dashboardPanelSchema } from
  '../../schema/dashboard-panel/dashboard-panel.schema.js';

export type DashboardPanelProps = z.input<typeof dashboardPanelSchema>;
