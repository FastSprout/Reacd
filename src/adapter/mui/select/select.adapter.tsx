import type { ComponentProps, ComponentType } from 'react';
import { SharedSelect } from '../../shared/select/select.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSelectProps = ComponentProps<typeof SharedSelect>;
export const MuiSelect: ComponentType<MuiSelectProps> = bindPrimitives(
  SharedSelect,
  muiPrimitives,
  'MuiSelect',
);
