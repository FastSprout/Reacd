import type { DashboardToolbarProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-toolbar/index.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnDashboardToolbarProps = DashboardToolbarProps;
export function ShadcnDashboardToolbar({
  label,
  start,
  children,
  end,
}: DashboardToolbarProps) {
  return (
    <CardContent
      role="group"
      aria-label={label}
      className="flex min-w-0 flex-wrap items-center gap-4 p-0"
    >
      {start}
      {children}
      {end}
    </CardContent>
  );
}
