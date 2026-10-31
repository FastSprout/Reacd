import type { ComponentProps, ComponentType } from 'react';
import { SharedProgress } from '../../shared/progress/progress.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiProgressProps = ComponentProps<typeof SharedProgress>;
export const MuiProgress: ComponentType<MuiProgressProps> = bindPrimitives(
  SharedProgress,
  muiPrimitives,
  'MuiProgress',
);
