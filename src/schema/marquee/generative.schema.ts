import { z } from 'zod';
import { marqueeContentSchema } from './marquee.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
export const marqueeNodeSchema = marqueeContentSchema.extend({
  type: z.literal('Marquee'),
  paused: stateBindingSchema,
});
