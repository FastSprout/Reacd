import type { ComponentProps, ComponentType } from 'react';
import { SharedToggle } from '../../shared/toggle/toggle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiToggleProps = ComponentProps<typeof SharedToggle>;
export const MuiToggle: ComponentType<MuiToggleProps> = bindPrimitives(
  SharedToggle,
  muiPrimitives,
  'MuiToggle',
);
