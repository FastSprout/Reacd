import type { ComponentProps, ComponentType } from 'react';
import { SharedPinInput } from '../../shared/pin-input/pin-input.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPinInputProps = ComponentProps<typeof SharedPinInput>;
export const MuiPinInput: ComponentType<MuiPinInputProps> = bindPrimitives(
  SharedPinInput,
  muiPrimitives,
  'MuiPinInput',
);
