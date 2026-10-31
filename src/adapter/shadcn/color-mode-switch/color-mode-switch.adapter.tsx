import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/color-mode-switch/color-mode-switch.adapter.js';
import { SharedColorModeSwitch } from
  '../../shared/color-mode-switch/color-mode-switch.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnColorModeSwitchProps = ComponentProps<typeof SharedColorModeSwitch>;
export const ShadcnColorModeSwitch: ComponentType<ShadcnColorModeSwitchProps> =
  bindPrimitives(SharedColorModeSwitch, shadcnPrimitives, 'ShadcnColorModeSwitch');
