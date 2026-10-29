import { z } from 'zod';
import { COLOR_MODE_ASPECTS } from '../../core/color-mode-policy.js';
import { avatarSourceSchema } from '../avatar/avatar.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';
import { labelSchema } from '../shared/values.js';

export const colorModeImageSchema = z.strictObject({
  mode: resolvedColorModeSchema,
  light: avatarSourceSchema,
  dark: avatarSourceSchema,
  alt: labelSchema,
  aspect: z.enum(COLOR_MODE_ASPECTS).optional(),
});
