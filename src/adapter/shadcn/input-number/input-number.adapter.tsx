import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input-number/input-number.adapter.js';
import { SharedInputNumber } from '../../shared/input-number/input-number.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputNumberProps = ComponentProps<typeof SharedInputNumber>;
export const ShadcnInputNumber: ComponentType<ShadcnInputNumberProps> = bindPrimitives(
  SharedInputNumber,
  shadcnPrimitives,
  'ShadcnInputNumber',
);
