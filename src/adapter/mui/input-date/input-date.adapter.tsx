import type { ComponentProps, ComponentType } from 'react';
import { SharedInputDate } from '../../shared/input-date/input-date.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputDateProps = ComponentProps<typeof SharedInputDate>;
export const MuiInputDate: ComponentType<MuiInputDateProps> = bindPrimitives(
  SharedInputDate,
  muiPrimitives,
  'MuiInputDate',
);
