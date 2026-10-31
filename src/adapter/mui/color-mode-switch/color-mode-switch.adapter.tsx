import type { ComponentProps, ComponentType } from 'react';
import { SharedColorModeSwitch } from
  '../../shared/color-mode-switch/color-mode-switch.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiColorModeSwitchProps = ComponentProps<typeof SharedColorModeSwitch>;
export const MuiColorModeSwitch: ComponentType<MuiColorModeSwitchProps> =
  bindPrimitives(SharedColorModeSwitch, muiPrimitives, 'MuiColorModeSwitch');
