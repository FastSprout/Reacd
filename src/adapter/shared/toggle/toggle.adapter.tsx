import { useId } from 'react';
import type { ToggleProps } from
  '@fastsprout/reacd/adapter-runtime/components/toggle/toggle.js';
import { Switch } from '../primitives/switch.js';
import { Label } from '../primitives/label.js';

export function SharedToggle({ label, onCheckedChange, ...properties }: ToggleProps) {
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
