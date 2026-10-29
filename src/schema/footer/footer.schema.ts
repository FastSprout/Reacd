import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';

export const footerSchema = z.strictObject({
  children: childrenSchema,
  start: childrenSchema,
  end: childrenSchema,
  top: childrenSchema,
  bottom: childrenSchema,
});
