import { z } from 'zod';
import { radioGroupSchema } from './radio-group.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

const { onValueChange: _change, ...properties } = radioGroupSchema.shape;
export const radioGroupNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('RadioGroup'),
  value: writeStateBindingSchema,
});
