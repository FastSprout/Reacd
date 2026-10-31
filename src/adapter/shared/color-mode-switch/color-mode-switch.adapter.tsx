import type { ColorModeSwitchProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-switch/index.js';
import { SharedSwitch } from '../switch/switch.adapter.js';

export function SharedColorModeSwitch({
  value: _value,
  resolvedMode,
  onValueChange,
  ...properties
}: ColorModeSwitchProps) {
  return (
    <SharedSwitch
      {...properties}
      checked={resolvedMode === 'dark'}
      onCheckedChange={(checked) => onValueChange(checked ? 'dark' : 'light')}
    />
  );
}
