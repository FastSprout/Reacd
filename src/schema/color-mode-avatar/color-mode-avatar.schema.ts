import { avatarSchema, avatarSourceSchema } from '../avatar/avatar.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';

export const colorModeAvatarSchema = avatarSchema.omit({ src: true }).extend({
  mode: resolvedColorModeSchema,
  light: avatarSourceSchema,
  dark: avatarSourceSchema,
});
