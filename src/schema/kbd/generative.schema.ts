import { z } from 'zod';
import { kbdSchema } from './kbd.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';
export const kbdNodeSchema = z.strictObject({
  ...kbdSchema.shape,
  type: z.literal('Kbd'),
  value: z.union([kbdSchema.shape.value, readStateBindingSchema]),
});
