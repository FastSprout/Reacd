import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { dashboardGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-group/dashboard-group.schema.js';
import { MuiDashboardGroup } from '../dashboard-group/dashboard-group.adapter.js';
import { dashboardSidebarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-sidebar/index.js';
import { MuiDashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar.adapter.js';
import { dashboardPanelSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-panel/dashboard-panel.schema.js';
import { MuiDashboardPanel } from '../dashboard-panel/dashboard-panel.adapter.js';
import { dashboardNavbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-navbar/index.js';
import { MuiDashboardNavbar } from '../dashboard-navbar/dashboard-navbar.adapter.js';
import { dashboardToolbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-toolbar/index.js';
import { MuiDashboardToolbar } from '../dashboard-toolbar/dashboard-toolbar.adapter.js';
import { dashboardSidebarCollapseSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-sidebar-collapse/index.js';
import { MuiDashboardSidebarCollapse } from
  '../dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { dashboardSidebarToggleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-sidebar-toggle/index.js';
import { MuiDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';
import { dashboardResizeHandleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-resize-handle/index.js';
import { MuiDashboardResizeHandle } from
  '../dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { dashboardSearchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-search/index.js';
import { MuiDashboardSearch } from '../dashboard-search/dashboard-search.adapter.js';
import { dashboardSearchButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-search-button/index.js';
import { MuiDashboardSearchButton } from
  '../dashboard-search-button/dashboard-search-button.adapter.js';

export const dashboardEntries = {
  DashboardGroup: renderEntry(
    'DashboardGroup',
    dashboardGroupSchema,
    MuiDashboardGroup,
  ),
  DashboardSidebar: renderEntry(
    'DashboardSidebar',
    dashboardSidebarSchema,
    MuiDashboardSidebar,
  ),
  DashboardPanel: renderEntry(
    'DashboardPanel',
    dashboardPanelSchema,
    MuiDashboardPanel,
  ),
  DashboardNavbar: renderEntry(
    'DashboardNavbar',
    dashboardNavbarSchema,
    MuiDashboardNavbar,
  ),
  DashboardToolbar: renderEntry(
    'DashboardToolbar',
    dashboardToolbarSchema,
    MuiDashboardToolbar,
  ),
  DashboardSidebarCollapse: renderEntry(
    'DashboardSidebarCollapse',
    dashboardSidebarCollapseSchema,
    MuiDashboardSidebarCollapse,
  ),
  DashboardSidebarToggle: renderEntry(
    'DashboardSidebarToggle',
    dashboardSidebarToggleSchema,
    MuiDashboardSidebarToggle,
  ),
  DashboardResizeHandle: renderEntry(
    'DashboardResizeHandle',
    dashboardResizeHandleSchema,
    MuiDashboardResizeHandle,
  ),
  DashboardSearch: renderEntry(
    'DashboardSearch',
    dashboardSearchSchema,
    MuiDashboardSearch,
  ),
  DashboardSearchButton: renderEntry(
    'DashboardSearchButton',
    dashboardSearchButtonSchema,
    MuiDashboardSearchButton,
  ),
};
