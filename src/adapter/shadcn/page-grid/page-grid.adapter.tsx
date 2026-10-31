import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-grid/page-grid.adapter.js';
import { SharedPageGrid } from '../../shared/page-grid/page-grid.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageGridProps = ComponentProps<typeof SharedPageGrid>;
export const ShadcnPageGrid: ComponentType<ShadcnPageGridProps> = bindPrimitives(
  SharedPageGrid,
  shadcnPrimitives,
  'ShadcnPageGrid',
);
