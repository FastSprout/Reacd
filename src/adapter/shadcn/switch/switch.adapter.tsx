import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/switch/switch.adapter.js';
import { SharedSwitch } from '../../shared/switch/switch.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSwitchProps = ComponentProps<typeof SharedSwitch>;
export const ShadcnSwitch: ComponentType<ShadcnSwitchProps> = bindPrimitives(
  SharedSwitch,
  shadcnPrimitives,
  'ShadcnSwitch',
);
