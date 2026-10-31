import type { ComponentProps, ComponentType } from 'react';
import { SharedSwitch } from '../../shared/switch/switch.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSwitchProps = ComponentProps<typeof SharedSwitch>;
export const MuiSwitch: ComponentType<MuiSwitchProps> = bindPrimitives(
  SharedSwitch,
  muiPrimitives,
  'MuiSwitch',
);
