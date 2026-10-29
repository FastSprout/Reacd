import { z } from 'zod';
import { FIELD_GROUP_ORIENTATIONS } from '../../core/field-group-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';

export const fieldGroupSchema = z.strictObject({
  label: labelSchema,
  orientation: z.enum(FIELD_GROUP_ORIENTATIONS).optional(),
  children: childrenSchema,
});
