import type { ComponentProps, ComponentType } from 'react';
import { SharedSkeleton } from '../../shared/skeleton/skeleton.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSkeletonProps = ComponentProps<typeof SharedSkeleton>;
export const MuiSkeleton: ComponentType<MuiSkeletonProps> = bindPrimitives(
  SharedSkeleton,
  muiPrimitives,
  'MuiSkeleton',
);
