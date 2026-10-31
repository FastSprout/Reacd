import type { ComponentProps, ComponentType } from 'react';
import { SharedGrid } from '../../shared/grid/grid.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiGridProps = ComponentProps<typeof SharedGrid>;
export const MuiGrid: ComponentType<MuiGridProps> = bindPrimitives(
  SharedGrid,
  muiPrimitives,
  'MuiGrid',
);
