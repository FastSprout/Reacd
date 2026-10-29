import type {
  ColorModeSwitchProps,
} from '../../../components/color-mode-switch/index.js';
import { ShadcnSwitch } from '../switch/switch.adapter.js';

export function ShadcnColorModeSwitch({
  value: _value,
  resolvedMode,
  onValueChange,
  ...properties
}: ColorModeSwitchProps) {
  return (
    <ShadcnSwitch
      {...properties}
      checked={resolvedMode === 'dark'}
      onCheckedChange={(checked) => onValueChange(checked ? 'dark' : 'light')}
    />
  );
}
