import type { ComponentProps, ComponentType } from 'react';
import { SharedInput } from '../../shared/input/input.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputProps = ComponentProps<typeof SharedInput>;
export const MuiInput: ComponentType<MuiInputProps> = bindPrimitives(
  SharedInput,
  muiPrimitives,
  'MuiInput',
);
