import { z } from 'zod';
import { COLOR_MODE_ASPECTS } from '../../core/color-mode-policy.js';
import { avatarSourceSchema } from '../avatar/avatar.schema.js';
import { labelSchema } from '../shared/values.js';

export const imageSchema = z.strictObject({
  src: avatarSourceSchema,
  alt: labelSchema,
  aspect: z.enum(COLOR_MODE_ASPECTS).optional(),
});
