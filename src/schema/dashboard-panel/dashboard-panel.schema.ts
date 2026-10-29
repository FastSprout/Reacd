import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const dashboardPanelSchema = z.strictObject({
  label: labelSchema.optional(),
  children: childrenSchema,
  header: childrenSchema,
  footer: childrenSchema,
});
