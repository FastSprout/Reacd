import { useContext } from 'react';
import type { DashboardSidebarToggleProps } from
  '../../../components/dashboard-sidebar-toggle/index.js';
import { DASHBOARD_DEFAULTS } from '../../../core/dashboard-policy.js';
import { DashboardContext } from '../../../renderer/dashboard/dashboard-context.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnDashboardSidebarToggle({
  label,
  disabled,
}: DashboardSidebarToggleProps) {
  const group = useContext(DashboardContext);
  if (group === null)
    return (
      <Issues
        issues={[
          { path: 'DashboardSidebarToggle', message: DASHBOARD_DEFAULTS.missingGroup },
        ]}
      />
    );
  if (!group.narrow) return null;
  return (
    <Button
      className="reacd-node reacd-button"
      variant="secondary"
      disabled={disabled || group.disabled}
      aria-expanded={group.mobileOpen}
      onClick={(event) => {
        group.rememberTrigger(event.currentTarget);
        group.onMobileOpenChange(!group.mobileOpen);
      }}
    >
      {label ??
        (group.mobileOpen
          ? DASHBOARD_DEFAULTS.closeLabel
          : DASHBOARD_DEFAULTS.openLabel)}
    </Button>
  );
}
