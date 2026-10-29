import type { ReactNode } from 'react';
import type { SliderProps } from './slider.props.js';
import { sliderSchema } from '../../schema/slider/slider.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SliderProps } from './slider.props.js';
export function Slider(props: SliderProps): ReactNode {
  return useDeclaration('Slider', sliderSchema, props);
}
