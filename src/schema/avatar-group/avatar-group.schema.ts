import { z } from 'zod';
import { AVATAR_POLICY } from '../../core/avatar-policy.js';
import { CONTENT_POLICY } from '../../core/policy.js';
import { avatarSchema } from '../avatar/avatar.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { labelSchema } from '../shared/values.js';

const { size, ...identity } = avatarSchema.shape;
export const avatarGroupSchema = z.strictObject({
  label: labelSchema,
  size,
  max: z
    .number()
    .int()
    .min(AVATAR_POLICY.minVisible)
    .max(CONTENT_POLICY.maxOptions)
    .optional(),
  emptyMessage: labelSchema.optional(),
  items: z
    .array(z.strictObject({ id: stateKeySchema, ...identity }))
    .max(CONTENT_POLICY.maxOptions)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'Avatar item IDs must be unique.',
    )
    .readonly(),
});
