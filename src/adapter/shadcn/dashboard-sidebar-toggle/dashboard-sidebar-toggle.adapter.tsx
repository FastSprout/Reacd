import { useContext } from 'react';
import { MenuIcon } from 'lucide-react';
import type { DashboardSidebarToggleProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-sidebar-toggle/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { DashboardContext } from '../dashboard-group/dashboard-context.js';
import { DashboardDiagnostic } from '../dashboard-group/diagnostic.js';

export type ShadcnDashboardSidebarToggleProps = DashboardSidebarToggleProps;
export function ShadcnDashboardSidebarToggle({
  label = DASHBOARD_DEFAULTS.openLabel,
  disabled,
}: DashboardSidebarToggleProps) {
  const scope = useContext(DashboardContext);
  const metadata = useNativeField({ disabled });
  if (scope === null)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.missingGroup} />;
  if (!scope.narrow) return null;
  const { mobileOpen, onMobileOpenChange } = scope.properties;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={scope.blocked || metadata.blocked}
      aria-haspopup="dialog"
      aria-label={label}
      aria-expanded={mobileOpen}
      onClick={(event) => {
        event.currentTarget.focus();
        onMobileOpenChange(!mobileOpen);
      }}
    >
      <MenuIcon aria-hidden />
    </Button>
  );
}
