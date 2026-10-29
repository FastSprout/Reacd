import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const dashboardNavbarSchema = z.strictObject({
  title: labelSchema.optional(),
  children: childrenSchema,
  leading: childrenSchema,
  trailing: childrenSchema,
  start: childrenSchema,
  end: childrenSchema,
});
