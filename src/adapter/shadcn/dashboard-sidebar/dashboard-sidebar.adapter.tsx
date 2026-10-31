import { useContext } from 'react';
import type { DashboardSidebarProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-sidebar/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import {
  DashboardContext,
  DashboardRegionContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/dashboard/dashboard-context.js';
import { SidebarEnvironmentContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/sidebar/sidebar-environment.js';
import { Issues } from
  '@fastsprout/reacd/adapter-runtime/renderer/issues/issues.renderer.js';
import { ShadcnSidebar } from '../sidebar/sidebar.adapter.js';

export function ShadcnDashboardSidebar(properties: DashboardSidebarProps) {
  const group = useContext(DashboardContext);
  const position = useContext(DashboardRegionContext);
  if (group === null || position === null || position.region.kind !== 'sidebar')
    return (
      <Issues
        issues={[
          { path: 'DashboardSidebar', message: DASHBOARD_DEFAULTS.wrongSidebar },
        ]}
      />
    );
  return (
    <SidebarEnvironmentContext.Provider
      value={{
        narrow: group.narrow,
        trigger: group.mobileTrigger,
      }}
    >
      <ShadcnSidebar
        {...properties}
        title={position.region.label}
        open={group.open}
        onOpenChange={group.onOpenChange}
        mobileOpen={group.mobileOpen}
        onMobileOpenChange={group.onMobileOpenChange}
        collapsible={group.collapseMode}
        disabled={group.disabled}
      />
    </SidebarEnvironmentContext.Provider>
  );
}
