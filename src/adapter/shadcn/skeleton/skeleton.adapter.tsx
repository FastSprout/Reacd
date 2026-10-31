import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/skeleton/skeleton.adapter.js';
import { SharedSkeleton } from '../../shared/skeleton/skeleton.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSkeletonProps = ComponentProps<typeof SharedSkeleton>;
export const ShadcnSkeleton: ComponentType<ShadcnSkeletonProps> = bindPrimitives(
  SharedSkeleton,
  shadcnPrimitives,
  'ShadcnSkeleton',
);
