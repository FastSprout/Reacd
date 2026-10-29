import { z } from 'zod';
import { menuRootShape } from '../action-menu/root.schema.js';
import { childrenSchema } from '../shared/children.js';
export const contextMenuSchema = z.strictObject({
  ...menuRootShape,
  children: childrenSchema,
});
