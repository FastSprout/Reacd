import { useContext } from 'react';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import type { DashboardSidebarCollapseProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-sidebar-collapse/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { DashboardContext } from '../dashboard-group/dashboard-context.js';
import { DashboardDiagnostic } from '../dashboard-group/diagnostic.js';

export type ShadcnDashboardSidebarCollapseProps = DashboardSidebarCollapseProps;
export function ShadcnDashboardSidebarCollapse({
  label,
  disabled,
}: DashboardSidebarCollapseProps) {
  const scope = useContext(DashboardContext);
  const metadata = useNativeField({ disabled });
  if (scope === null)
    return <DashboardDiagnostic message={DASHBOARD_DEFAULTS.missingGroup} />;
  if (scope.narrow) return null;
  const { open, onOpenChange } = scope.properties;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={scope.blocked || metadata.blocked}
      aria-expanded={open}
      aria-label={
        label ??
        (open ? DASHBOARD_DEFAULTS.collapseLabel : DASHBOARD_DEFAULTS.expandLabel)
      }
      onClick={() => onOpenChange(!open)}
    >
      {open ? <PanelLeftCloseIcon aria-hidden /> : <PanelLeftOpenIcon aria-hidden />}
    </Button>
  );
}
