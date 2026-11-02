import type { ColorModeSwitchProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-switch/index.js';
import { MuiSwitch } from '../switch/switch.adapter.js';

export type MuiColorModeSwitchProps = ColorModeSwitchProps;

export function MuiColorModeSwitch(props: MuiColorModeSwitchProps) {
  return (
    <MuiSwitch
      label={props.label}
      description={props.description}
      disabled={props.disabled}
      readOnly={props.readOnly}
      checked={props.resolvedMode === 'dark'}
      onCheckedChange={(checked) => props.onValueChange(checked ? 'dark' : 'light')}
    />
  );
}
