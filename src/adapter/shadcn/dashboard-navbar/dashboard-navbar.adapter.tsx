import { useContext } from 'react';
import type { DashboardNavbarProps } from
  '../../../components/dashboard-navbar/index.js';
import { DASHBOARD_DEFAULTS } from '../../../core/dashboard-policy.js';
import {
  DashboardContext,
  DashboardRegionContext,
  DashboardMainContext,
} from '../../../renderer/dashboard/dashboard-context.js';
import { ShadcnDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';

export function ShadcnDashboardNavbar({
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
        {group !== null && <ShadcnDashboardSidebarToggle />}
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
