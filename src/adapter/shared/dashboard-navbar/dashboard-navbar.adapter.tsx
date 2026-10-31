import { useContext } from 'react';
import type { DashboardNavbarProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-navbar/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import {
  DashboardContext,
  DashboardRegionContext,
  DashboardMainContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/dashboard/dashboard-context.js';
import { SharedDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';

export function SharedDashboardNavbar({
  title,
  children,
  leading,
  trailing,
  start,
  end,
}: DashboardNavbarProps) {
  const group = useContext(DashboardContext);
  const position = useContext(DashboardRegionContext);
  const primary = useContext(DashboardMainContext);
  const Heading = primary ? 'h1' : 'h2';
  return (
    <header className="reacd-node reacd-dashboard-navbar">
      <div className="reacd-dashboard-actions">
        {group !== null && <SharedDashboardSidebarToggle />}
        {start}
        {leading}
        <Heading>{title ?? position?.region.label ?? DASHBOARD_DEFAULTS.title}</Heading>
        {trailing}
      </div>
      {children}
      <div className="reacd-dashboard-actions">{end}</div>
    </header>
  );
}
