import { useId } from 'react';
import type { ToggleProps } from '../../../components/toggle/toggle.js';
import { Switch } from '../vendor/ui/switch.js';
import { Label } from '../vendor/ui/label.js';

export function ShadcnToggle({ label, onCheckedChange, ...properties }: ToggleProps) {
  const id = useId();
  return (
    <div className="reacd-node reacd-check reacd-toggle">
      <Switch
        id={id}
        {...properties}
        onCheckedChange={(next) => onCheckedChange(next)}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
