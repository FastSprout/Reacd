import { z } from 'zod';
import { APPLICATION_POLICY } from '../../core/application-shell-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';

export const errorSchema = z.strictObject({
  statusCode: z
    .number()
    .int()
    .min(APPLICATION_POLICY.minimumErrorStatus)
    .max(APPLICATION_POLICY.maximumErrorStatus),
  title: labelSchema,
  message: textSchema.optional(),
  leading: childrenSchema,
  actions: childrenSchema,
  children: childrenSchema,
  redirect: linkSchema.shape.href.optional(),
  recoveryLabel: labelSchema.optional(),
});
