import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/slider/slider.adapter.js';
import { SharedSlider } from '../../shared/slider/slider.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSliderProps = ComponentProps<typeof SharedSlider>;
export const ShadcnSlider: ComponentType<ShadcnSliderProps> = bindPrimitives(
  SharedSlider,
  shadcnPrimitives,
  'ShadcnSlider',
);
