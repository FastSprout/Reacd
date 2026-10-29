import { z } from 'zod';
import { paginationSchema } from './pagination.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
const { onValueChange: _change, value: _value, ...properties } = paginationSchema.shape;
export const paginationNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('Pagination'),
  value: stateBindingSchema,
});
