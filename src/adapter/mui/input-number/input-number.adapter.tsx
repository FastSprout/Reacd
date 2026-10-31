import type { ComponentProps, ComponentType } from 'react';
import { SharedInputNumber } from '../../shared/input-number/input-number.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputNumberProps = ComponentProps<typeof SharedInputNumber>;
export const MuiInputNumber: ComponentType<MuiInputNumberProps> = bindPrimitives(
  SharedInputNumber,
  muiPrimitives,
  'MuiInputNumber',
);
