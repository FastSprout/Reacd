import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const dashboardToolbarSchema = z.strictObject({
  label: labelSchema,
  children: childrenSchema,
  start: childrenSchema,
  end: childrenSchema,
});
