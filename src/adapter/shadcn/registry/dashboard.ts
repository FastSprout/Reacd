import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { dashboardGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-group/dashboard-group.schema.js';
import { ShadcnDashboardGroup } from '../dashboard-group/dashboard-group.adapter.js';
import { dashboardSidebarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-sidebar/index.js';
import { ShadcnDashboardSidebar } from
  '../dashboard-sidebar/dashboard-sidebar.adapter.js';
import { dashboardPanelSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-panel/dashboard-panel.schema.js';
import { ShadcnDashboardPanel } from '../dashboard-panel/dashboard-panel.adapter.js';
import { dashboardNavbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-navbar/index.js';
import { ShadcnDashboardNavbar } from '../dashboard-navbar/dashboard-navbar.adapter.js';
import { dashboardToolbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-toolbar/index.js';
import { ShadcnDashboardToolbar } from
  '../dashboard-toolbar/dashboard-toolbar.adapter.js';
import { dashboardSidebarCollapseSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-sidebar-collapse/index.js';
import { ShadcnDashboardSidebarCollapse } from
  '../dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { dashboardSidebarToggleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-sidebar-toggle/index.js';
import { ShadcnDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';
import { dashboardResizeHandleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-resize-handle/index.js';
import { ShadcnDashboardResizeHandle } from
  '../dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { dashboardSearchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-search/index.js';
import { ShadcnDashboardSearch } from '../dashboard-search/dashboard-search.adapter.js';
import { dashboardSearchButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dashboard-search-button/index.js';
import { ShadcnDashboardSearchButton } from
  '../dashboard-search-button/dashboard-search-button.adapter.js';

export const dashboardEntries = {
  DashboardGroup: renderEntry(
    'DashboardGroup',
    dashboardGroupSchema,
    ShadcnDashboardGroup,
  ),
  DashboardSidebar: renderEntry(
    'DashboardSidebar',
    dashboardSidebarSchema,
    ShadcnDashboardSidebar,
  ),
  DashboardPanel: renderEntry(
    'DashboardPanel',
    dashboardPanelSchema,
    ShadcnDashboardPanel,
  ),
  DashboardNavbar: renderEntry(
    'DashboardNavbar',
    dashboardNavbarSchema,
    ShadcnDashboardNavbar,
  ),
  DashboardToolbar: renderEntry(
    'DashboardToolbar',
    dashboardToolbarSchema,
    ShadcnDashboardToolbar,
  ),
  DashboardSidebarCollapse: renderEntry(
    'DashboardSidebarCollapse',
    dashboardSidebarCollapseSchema,
    ShadcnDashboardSidebarCollapse,
  ),
  DashboardSidebarToggle: renderEntry(
    'DashboardSidebarToggle',
    dashboardSidebarToggleSchema,
    ShadcnDashboardSidebarToggle,
  ),
  DashboardResizeHandle: renderEntry(
    'DashboardResizeHandle',
    dashboardResizeHandleSchema,
    ShadcnDashboardResizeHandle,
  ),
  DashboardSearch: renderEntry(
    'DashboardSearch',
    dashboardSearchSchema,
    ShadcnDashboardSearch,
  ),
  DashboardSearchButton: renderEntry(
    'DashboardSearchButton',
    dashboardSearchButtonSchema,
    ShadcnDashboardSearchButton,
  ),
};
