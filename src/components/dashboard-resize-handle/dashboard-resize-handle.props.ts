import type { z } from 'zod';
import type { dashboardResizeHandleSchema } from
  '../../schema/dashboard-resize-handle/dashboard-resize-handle.schema.js';

export type DashboardResizeHandleProps = z.input<typeof dashboardResizeHandleSchema>;
