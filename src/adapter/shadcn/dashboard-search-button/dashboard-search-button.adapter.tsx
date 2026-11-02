import { SearchIcon } from 'lucide-react';
import type { DashboardSearchButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/dashboard-search-button/index.js';
import { DASHBOARD_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/dashboard-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnDashboardSearchButtonProps = DashboardSearchButtonProps;
export function ShadcnDashboardSearchButton({
  label = DASHBOARD_DEFAULTS.searchLabel,
  onPress,
  disabled,
}: DashboardSearchButtonProps) {
  const metadata = useNativeField({ disabled });
  return (
    <Button
      type="button"
      variant="outline"
      aria-haspopup="dialog"
      className="min-w-0 max-w-full whitespace-normal break-words"
      style={{
        height: 'auto',
        minBlockSize: LAYOUT_POLICY.controlTargetPx,
        overflowWrap: 'anywhere',
      }}
      disabled={metadata.blocked}
      onClick={(event) => {
        event.currentTarget.focus();
        onPress();
      }}
    >
      <SearchIcon aria-hidden />
      {label}
    </Button>
  );
}
