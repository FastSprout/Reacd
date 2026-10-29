import { z } from 'zod';
import { booleanChangeSchema, labelSchema } from '../shared/values.js';
import { menuItemsSchema } from './items.schema.js';
export const menuRootShape = {
  label: labelSchema,
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  items: menuItemsSchema,
  disabled: z.boolean().optional(),
};
