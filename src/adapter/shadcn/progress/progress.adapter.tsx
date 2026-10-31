import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/progress/progress.adapter.js';
import { SharedProgress } from '../../shared/progress/progress.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnProgressProps = ComponentProps<typeof SharedProgress>;
export const ShadcnProgress: ComponentType<ShadcnProgressProps> = bindPrimitives(
  SharedProgress,
  shadcnPrimitives,
  'ShadcnProgress',
);
