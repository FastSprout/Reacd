import { z } from 'zod';
import { dropdownMenuSchema } from './dropdown-menu.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { menuNodeItemsSchema } from '../action-menu/generative.schema.js';
const { onOpenChange: _change, ...properties } = dropdownMenuSchema.shape;
export const dropdownMenuNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('DropdownMenu'),
  open: writeStateBindingSchema,
  items: menuNodeItemsSchema,
});
