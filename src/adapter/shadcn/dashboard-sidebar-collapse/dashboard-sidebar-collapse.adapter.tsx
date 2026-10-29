import { useContext } from 'react';
import type { DashboardSidebarCollapseProps } from
  '../../../components/dashboard-sidebar-collapse/index.js';
import { DASHBOARD_DEFAULTS } from '../../../core/dashboard-policy.js';
import { DashboardContext } from '../../../renderer/dashboard/dashboard-context.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnDashboardSidebarCollapse({
  label,
  disabled,
}: DashboardSidebarCollapseProps) {
  const group = useContext(DashboardContext);
  if (group === null)
    return (
      <Issues
        issues={[
          {
            path: 'DashboardSidebarCollapse',
            message: DASHBOARD_DEFAULTS.missingGroup,
          },
        ]}
      />
    );
  if (group.narrow) return null;
  return (
    <Button
      className="reacd-node reacd-button"
      variant="secondary"
      disabled={disabled || group.disabled}
      aria-expanded={group.open}
      onClick={() => group.onOpenChange(!group.open)}
    >
      {label ??
        (group.open
          ? DASHBOARD_DEFAULTS.collapseLabel
          : DASHBOARD_DEFAULTS.expandLabel)}
    </Button>
  );
}
