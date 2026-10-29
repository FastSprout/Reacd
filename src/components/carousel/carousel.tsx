import type { ReactNode } from 'react';
import type { CarouselProps } from './carousel.props.js';
import { carouselSchema } from '../../schema/carousel/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function Carousel(properties: CarouselProps): ReactNode {
  return useDeclaration('Carousel', carouselSchema, properties);
}
