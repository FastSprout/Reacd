import { z } from 'zod';
import { contentSearchButtonSchema } from './content-search-button.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

const { onOpenChange: _change, ...shape } = contentSearchButtonSchema.shape;
export const contentSearchButtonNodeSchema = z.strictObject({
  ...shape,
  type: z.literal('ContentSearchButton'),
  open: writeStateBindingSchema,
});
