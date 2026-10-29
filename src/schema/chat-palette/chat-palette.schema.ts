import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';

export const chatPaletteSchema = z.strictObject({
  label: labelSchema,
  children: childrenSchema,
  prompt: childrenSchema,
});
