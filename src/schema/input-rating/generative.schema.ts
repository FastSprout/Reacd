import { z } from 'zod';
import { inputRatingSchema } from './input-rating.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

const {
  value: _value,
  onValueChange: _change,
  ...properties
} = inputRatingSchema.shape;
export const inputRatingNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('InputRating'),
  value: stateBindingSchema,
});
