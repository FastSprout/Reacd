import { useContext } from 'react';
import type { DashboardSidebarProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-sidebar/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import {
  DashboardContext,
  DashboardRegionContext,
} from '../dashboard-group/dashboard-context.js';
import { DashboardDiagnostic } from '../dashboard-group/diagnostic.js';
import { ShadcnSidebar } from '../sidebar/sidebar.adapter.js';

export type ShadcnDashboardSidebarProps = DashboardSidebarProps;
export function ShadcnDashboardSidebar(properties: DashboardSidebarProps) {
  const group = useContext(DashboardContext);
  const region = useContext(DashboardRegionContext);
  if (group === null || region === null)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.missingGroup} />;
  if (region.kind !== 'sidebar')
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.wrongSidebar} />;
  return (
    <ShadcnSidebar
      {...group.properties}
      {...properties}
      title={region.label}
      collapsible={group.properties.collapseMode}
      narrow={group.narrow}
      disabled={group.blocked}
      showTrigger={false}
    />
  );
}
