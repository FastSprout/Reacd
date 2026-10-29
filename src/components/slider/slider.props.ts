import type { z } from 'zod';
import type { sliderSchema } from '../../schema/slider/slider.schema.js';

export type SliderProps = z.infer<typeof sliderSchema>;
