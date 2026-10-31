import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/carousel/carousel.adapter.js';
import { SharedCarousel } from '../../shared/carousel/carousel.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCarouselProps = ComponentProps<typeof SharedCarousel>;
export const ShadcnCarousel: ComponentType<ShadcnCarouselProps> = bindPrimitives(
  SharedCarousel,
  shadcnPrimitives,
  'ShadcnCarousel',
);
