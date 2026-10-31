import { useContext } from 'react';
import type { DashboardSidebarCollapseProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-sidebar-collapse/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { DashboardContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/dashboard/dashboard-context.js';
import { Issues } from
  '@fastsprout/reacd/adapter-runtime/renderer/issues/issues.renderer.js';
import { Button } from '../primitives/button.js';

export function SharedDashboardSidebarCollapse({
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
