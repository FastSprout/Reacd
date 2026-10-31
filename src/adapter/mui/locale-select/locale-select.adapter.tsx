import type { ComponentProps, ComponentType } from 'react';
import { SharedLocaleSelect } from
  '../../shared/locale-select/locale-select.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiLocaleSelectProps = ComponentProps<typeof SharedLocaleSelect>;
export const MuiLocaleSelect: ComponentType<MuiLocaleSelectProps> = bindPrimitives(
  SharedLocaleSelect,
  muiPrimitives,
  'MuiLocaleSelect',
);
