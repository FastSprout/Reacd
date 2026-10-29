import { z } from 'zod';
import { switchSchema } from './switch.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

const {
  onCheckedChange: _change,
  checked: _checked,
  ...properties
} = switchSchema.shape;
export const switchNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('Switch'),
  checked: stateBindingSchema,
});
