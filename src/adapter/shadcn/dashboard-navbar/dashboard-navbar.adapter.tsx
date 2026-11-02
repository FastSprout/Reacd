import { useContext } from 'react';
import type { DashboardNavbarProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-navbar/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { CardContent } from '../vendor/ui/card.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import {
  DashboardContext,
  DashboardRegionContext,
} from '../dashboard-group/dashboard-context.js';
import { ShadcnDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';

export type ShadcnDashboardNavbarProps = DashboardNavbarProps;
export function ShadcnDashboardNavbar({
  title,
  leading,
  trailing,
  start,
  end,
  children,
}: DashboardNavbarProps) {
  const region = useContext(DashboardRegionContext);
  const scope = useContext(DashboardContext);
  const level = useContext(HeadingLevelContext);
  return (
    <CardContent
      className="flex min-w-0 flex-wrap items-center gap-4 p-0"
      style={{ overflowWrap: 'anywhere' }}
    >
      {scope !== null && <ShadcnDashboardSidebarToggle />}
      {leading}
      {start}
      <ShadcnProseHeading level={level}>
        {title ?? region?.label ?? DASHBOARD_DEFAULTS.title}
      </ShadcnProseHeading>
      {children}
      {end}
      {trailing}
    </CardContent>
  );
}
