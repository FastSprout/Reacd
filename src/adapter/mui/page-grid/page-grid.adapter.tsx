import type { ComponentProps, ComponentType } from 'react';
import { SharedPageGrid } from '../../shared/page-grid/page-grid.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageGridProps = ComponentProps<typeof SharedPageGrid>;
export const MuiPageGrid: ComponentType<MuiPageGridProps> = bindPrimitives(
  SharedPageGrid,
  muiPrimitives,
  'MuiPageGrid',
);
