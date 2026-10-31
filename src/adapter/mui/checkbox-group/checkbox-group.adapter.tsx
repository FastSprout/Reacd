import type { ComponentProps, ComponentType } from 'react';
import { SharedCheckboxGroup } from
  '../../shared/checkbox-group/checkbox-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCheckboxGroupProps = ComponentProps<typeof SharedCheckboxGroup>;
export const MuiCheckboxGroup: ComponentType<MuiCheckboxGroupProps> = bindPrimitives(
  SharedCheckboxGroup,
  muiPrimitives,
  'MuiCheckboxGroup',
);
