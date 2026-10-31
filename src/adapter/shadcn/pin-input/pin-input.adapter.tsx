import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/pin-input/pin-input.adapter.js';
import { SharedPinInput } from '../../shared/pin-input/pin-input.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPinInputProps = ComponentProps<typeof SharedPinInput>;
export const ShadcnPinInput: ComponentType<ShadcnPinInputProps> = bindPrimitives(
  SharedPinInput,
  shadcnPrimitives,
  'ShadcnPinInput',
);
