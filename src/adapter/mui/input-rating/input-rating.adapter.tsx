import type { ComponentProps, ComponentType } from 'react';
import { SharedInputRating } from '../../shared/input-rating/input-rating.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputRatingProps = ComponentProps<typeof SharedInputRating>;
export const MuiInputRating: ComponentType<MuiInputRatingProps> = bindPrimitives(
  SharedInputRating,
  muiPrimitives,
  'MuiInputRating',
);
