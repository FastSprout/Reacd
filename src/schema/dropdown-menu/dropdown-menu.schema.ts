import { z } from 'zod';
import { menuRootShape } from '../action-menu/root.schema.js';
export const dropdownMenuSchema = z.strictObject({
  ...menuRootShape,
  modal: z.boolean().optional(),
});
