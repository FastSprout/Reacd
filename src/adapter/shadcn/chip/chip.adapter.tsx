import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chip/chip.adapter.js';
import { SharedChip } from '../../shared/chip/chip.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChipProps = ComponentProps<typeof SharedChip>;
export const ShadcnChip: ComponentType<ShadcnChipProps> = bindPrimitives(
  SharedChip,
  shadcnPrimitives,
  'ShadcnChip',
);
