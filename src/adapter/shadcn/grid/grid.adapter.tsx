import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/grid/grid.adapter.js';
import { SharedGrid } from '../../shared/grid/grid.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnGridProps = ComponentProps<typeof SharedGrid>;
export const ShadcnGrid: ComponentType<ShadcnGridProps> = bindPrimitives(
  SharedGrid,
  shadcnPrimitives,
  'ShadcnGrid',
);
