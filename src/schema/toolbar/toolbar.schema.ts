import { z } from 'zod';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';

export const toolbarSchema = z.strictObject({
  children: childrenSchema,
  label: labelSchema,
});
