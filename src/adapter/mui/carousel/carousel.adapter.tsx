import type { ComponentProps, ComponentType } from 'react';
import { SharedCarousel } from '../../shared/carousel/carousel.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCarouselProps = ComponentProps<typeof SharedCarousel>;
export const MuiCarousel: ComponentType<MuiCarouselProps> = bindPrimitives(
  SharedCarousel,
  muiPrimitives,
  'MuiCarousel',
);
