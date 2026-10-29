import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const dashboardSidebarSchema = z.strictObject({
  description: labelSchema.optional(),
  children: childrenSchema,
  header: childrenSchema,
  footer: childrenSchema,
  actions: childrenSchema,
  collapsedContent: childrenSchema,
});
