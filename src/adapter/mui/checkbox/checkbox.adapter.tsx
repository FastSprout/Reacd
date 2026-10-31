import type { ComponentProps, ComponentType } from 'react';
import { SharedCheckbox } from '../../shared/checkbox/checkbox.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCheckboxProps = ComponentProps<typeof SharedCheckbox>;
export const MuiCheckbox: ComponentType<MuiCheckboxProps> = bindPrimitives(
  SharedCheckbox,
  muiPrimitives,
  'MuiCheckbox',
);
