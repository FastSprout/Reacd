import type { DashboardToolbarProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-toolbar/index.js';

export function SharedDashboardToolbar({
  label,
  start,
  children,
  end,
}: DashboardToolbarProps) {
  return (
    <div role="group" aria-label={label} className="reacd-node reacd-dashboard-toolbar">
      <div className="reacd-dashboard-actions">{start}</div>
      {children}
      <div className="reacd-dashboard-actions">{end}</div>
    </div>
  );
}
