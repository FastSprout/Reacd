import type { DashboardToolbarProps } from
  '../../../components/dashboard-toolbar/index.js';

export function ShadcnDashboardToolbar({
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
