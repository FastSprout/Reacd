import type { ComponentProps, ComponentType } from 'react';
import { SharedSlider } from '../../shared/slider/slider.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSliderProps = ComponentProps<typeof SharedSlider>;
export const MuiSlider: ComponentType<MuiSliderProps> = bindPrimitives(
  SharedSlider,
  muiPrimitives,
  'MuiSlider',
);
