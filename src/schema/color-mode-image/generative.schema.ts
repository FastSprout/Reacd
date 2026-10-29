import { z } from 'zod';
import { colorModeImageSchema } from './color-mode-image.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';

export const colorModeImageNodeSchema = colorModeImageSchema.extend({
  type: z.literal('ColorModeImage'),
  mode: z.union([resolvedColorModeSchema, readStateBindingSchema]),
});
