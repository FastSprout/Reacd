import type { z } from 'zod';
import type { carouselSchema } from '../../schema/carousel/index.js';
export type CarouselProps = z.infer<typeof carouselSchema>;
export type CarouselItem = CarouselProps['items'][number];
