export const DASHBOARD_REGION_KINDS = ['sidebar', 'panel'] as const;
export const DASHBOARD_COLLAPSE_MODES = ['offcanvas', 'icon'] as const;
export const DASHBOARD_POLICY = {
  iconShare: 10,
  zeroShare: 0,
} as const;
export const DASHBOARD_DEFAULTS = {
  disabled: false,
  collapseMode: 'offcanvas',
  title: 'Dashboard',
  searchLabel: 'Search dashboard',
  searchDescription: 'Find a dashboard destination or action.',
  openLabel: 'Open navigation',
  closeLabel: 'Close navigation',
  collapseLabel: 'Collapse navigation',
  expandLabel: 'Expand navigation',
  missingGroup: 'This dashboard control requires a DashboardGroup region.',
  wrongSidebar: 'DashboardSidebar requires a sidebar region.',
  missingPanelLabel: 'A standalone DashboardPanel requires a label.',
  stateRejected: 'Search state update was rejected. Edit the query to retry.',
} as const;
