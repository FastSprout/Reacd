import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { ToggleProps } from
  '@fastsprout/reacd/adapter-runtime/components/toggle/toggle.props.js';
import { Switch } from '../vendor/ui/switch.js';
import { Label } from '../vendor/ui/label.js';

import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnToggleProps = ToggleProps;
export function ShadcnToggle({
  label,
  checked,
  onCheckedChange,
  disabled,
}: ToggleProps) {
  const id = useId();
  const metadata = useNativeField({ disabled });
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(next) => {
          requestNativeChange(metadata.blocked, () => onCheckedChange(next));
        }}
        disabled={metadata.disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
