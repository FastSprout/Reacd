import type { DashboardSearchButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-search-button/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnDashboardSearchButton({
  label = DASHBOARD_DEFAULTS.searchLabel,
  onPress,
  disabled,
}: DashboardSearchButtonProps) {
  return (
    <Button
      className="reacd-node reacd-button"
      variant="secondary"
      disabled={disabled}
      onClick={() => onPress()}
    >
      {label}
    </Button>
  );
}
