import { z } from 'zod';
import { inputTagsSchema } from './input-tags.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
const { value: _value, onValueChange: _change, ...properties } = inputTagsSchema.shape;
export const inputTagsNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('InputTags'),
  value: stateBindingSchema,
});
