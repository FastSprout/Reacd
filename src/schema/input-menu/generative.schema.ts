import { z } from 'zod';
import { menuShape, validVisibleMenu } from '../form-menu-shared/menu.schema.js';
import { inputMenuItemsSchema } from './input-menu.schema.js';
import {
  stateBindingSchema,
  writeStateBindingSchema,
} from '../state/binding.schema.js';

export const inputMenuNodeSchema = z
  .strictObject({
    ...menuShape,
    items: inputMenuItemsSchema,
    type: z.literal('InputMenu'),
    value: stateBindingSchema,
    open: writeStateBindingSchema.optional(),
  })
  .refine(validVisibleMenu, 'Visible values must exist in suggestion items.');
export type InputMenuNode = z.infer<typeof inputMenuNodeSchema>;
