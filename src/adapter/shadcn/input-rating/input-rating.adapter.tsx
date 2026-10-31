import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input-rating/input-rating.adapter.js';
import { SharedInputRating } from '../../shared/input-rating/input-rating.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputRatingProps = ComponentProps<typeof SharedInputRating>;
export const ShadcnInputRating: ComponentType<ShadcnInputRatingProps> = bindPrimitives(
  SharedInputRating,
  shadcnPrimitives,
  'ShadcnInputRating',
);
