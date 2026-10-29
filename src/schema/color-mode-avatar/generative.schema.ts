import { z } from 'zod';
import { colorModeAvatarSchema } from './color-mode-avatar.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';

export const colorModeAvatarNodeSchema = colorModeAvatarSchema.extend({
  type: z.literal('ColorModeAvatar'),
  mode: z.union([resolvedColorModeSchema, readStateBindingSchema]),
});
