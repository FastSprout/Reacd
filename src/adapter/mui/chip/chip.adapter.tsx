import type { ComponentProps, ComponentType } from 'react';
import { SharedChip } from '../../shared/chip/chip.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChipProps = ComponentProps<typeof SharedChip>;
export const MuiChip: ComponentType<MuiChipProps> = bindPrimitives(
  SharedChip,
  muiPrimitives,
  'MuiChip',
);
