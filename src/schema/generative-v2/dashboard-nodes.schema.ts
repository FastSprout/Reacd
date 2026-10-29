import type { z } from 'zod';
import { dashboardGroupNodeSchema } from '../dashboard-group/generative.schema.js';
import { dashboardSidebarNodeSchema } from '../dashboard-sidebar/generative.schema.js';
import { dashboardPanelNodeSchema } from '../dashboard-panel/generative.schema.js';
import { dashboardNavbarNodeSchema } from '../dashboard-navbar/generative.schema.js';
import { dashboardToolbarNodeSchema } from '../dashboard-toolbar/generative.schema.js';
import { dashboardSidebarCollapseNodeSchema } from
  '../dashboard-sidebar-collapse/generative.schema.js';
import { dashboardSidebarToggleNodeSchema } from
  '../dashboard-sidebar-toggle/generative.schema.js';
import { dashboardResizeHandleNodeSchema } from
  '../dashboard-resize-handle/generative.schema.js';
import { dashboardSearchNodeSchema } from '../dashboard-search/generative.schema.js';
import { dashboardSearchButtonNodeSchema } from
  '../dashboard-search-button/generative.schema.js';

export function dashboardNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    dashboardGroupNodeSchema(content),
    dashboardSidebarNodeSchema(content),
    dashboardPanelNodeSchema(content),
    dashboardNavbarNodeSchema(content),
    dashboardToolbarNodeSchema(content),
    dashboardSidebarCollapseNodeSchema,
    dashboardSidebarToggleNodeSchema,
    dashboardResizeHandleNodeSchema,
    dashboardSearchNodeSchema,
    dashboardSearchButtonNodeSchema,
  ] as const;
}

export type DashboardLeaf =
  | z.infer<typeof dashboardSidebarCollapseNodeSchema>
  | z.infer<typeof dashboardSidebarToggleNodeSchema>
  | z.infer<typeof dashboardResizeHandleNodeSchema>
  | z.infer<typeof dashboardSearchNodeSchema>
  | z.infer<typeof dashboardSearchButtonNodeSchema>;
