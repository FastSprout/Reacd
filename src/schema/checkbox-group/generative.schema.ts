import { z } from 'zod';
import { checkboxGroupSchema } from './checkbox-group.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

const { onValueChange: _change, ...properties } = checkboxGroupSchema.shape;
export const checkboxGroupNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('CheckboxGroup'),
  value: writeStateBindingSchema,
});
