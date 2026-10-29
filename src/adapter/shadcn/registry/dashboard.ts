import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { dashboardGroupSchema } from
  '../../../schema/dashboard-group/dashboard-group.schema.js';
import { ShadcnDashboardGroup } from '../dashboard-group/dashboard-group.adapter.js';
import { dashboardSidebarSchema } from
  '../../../schema/dashboard-sidebar/dashboard-sidebar.schema.js';
import { ShadcnDashboardSidebar } from
  '../dashboard-sidebar/dashboard-sidebar.adapter.js';
import { dashboardPanelSchema } from
  '../../../schema/dashboard-panel/dashboard-panel.schema.js';
import { ShadcnDashboardPanel } from '../dashboard-panel/dashboard-panel.adapter.js';
import { dashboardNavbarSchema } from
  '../../../schema/dashboard-navbar/dashboard-navbar.schema.js';
import { ShadcnDashboardNavbar } from '../dashboard-navbar/dashboard-navbar.adapter.js';
import { dashboardToolbarSchema } from
  '../../../schema/dashboard-toolbar/dashboard-toolbar.schema.js';
import { ShadcnDashboardToolbar } from
  '../dashboard-toolbar/dashboard-toolbar.adapter.js';
import { dashboardSidebarCollapseSchema } from
  '../../../schema/dashboard-sidebar-collapse/dashboard-sidebar-collapse.schema.js';
import { ShadcnDashboardSidebarCollapse } from
  '../dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { dashboardSidebarToggleSchema } from
  '../../../schema/dashboard-sidebar-toggle/dashboard-sidebar-toggle.schema.js';
import { ShadcnDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';
import { dashboardResizeHandleSchema } from
  '../../../schema/dashboard-resize-handle/dashboard-resize-handle.schema.js';
import { ShadcnDashboardResizeHandle } from
  '../dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { dashboardSearchSchema } from
  '../../../schema/dashboard-search/dashboard-search.schema.js';
import { ShadcnDashboardSearch } from '../dashboard-search/dashboard-search.adapter.js';
import { dashboardSearchButtonSchema } from
  '../../../schema/dashboard-search-button/dashboard-search-button.schema.js';
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
