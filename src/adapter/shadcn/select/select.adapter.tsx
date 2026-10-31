import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/select/select.adapter.js';
import { SharedSelect } from '../../shared/select/select.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSelectProps = ComponentProps<typeof SharedSelect>;
export const ShadcnSelect: ComponentType<ShadcnSelectProps> = bindPrimitives(
  SharedSelect,
  shadcnPrimitives,
  'ShadcnSelect',
);
