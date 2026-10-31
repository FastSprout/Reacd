import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input/input.adapter.js';
import { SharedInput } from '../../shared/input/input.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputProps = ComponentProps<typeof SharedInput>;
export const ShadcnInput: ComponentType<ShadcnInputProps> = bindPrimitives(
  SharedInput,
  shadcnPrimitives,
  'ShadcnInput',
);
