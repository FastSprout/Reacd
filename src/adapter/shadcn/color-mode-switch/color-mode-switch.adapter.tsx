import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { ColorModeSwitchProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-switch/index.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Switch } from '../vendor/ui/switch.js';
import { Label } from '../vendor/ui/label.js';

export type ShadcnColorModeSwitchProps = ColorModeSwitchProps;
export function ShadcnColorModeSwitch({
  label,
  description,
  disabled,
  readOnly,
  resolvedMode,
  onValueChange,
}: ColorModeSwitchProps) {
  const id = useId();
  const metadata = useNativeField({ disabled }, description ? [`${id}-help`] : []);
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Switch
          id={id}
          checked={resolvedMode === 'dark'}
          disabled={metadata.disabled}
          aria-readonly={readOnly}
          aria-describedby={metadata.descriptionIds.join(' ') || undefined}
          onCheckedChange={(checked) => {
            requestNativeChange(Boolean(readOnly || metadata.blocked), () =>
              onValueChange(checked ? 'dark' : 'light'),
            );
          }}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
      {description && <p id={`${id}-help`}>{description}</p>}
    </div>
  );
}
