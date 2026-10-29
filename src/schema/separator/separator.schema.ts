import { z } from 'zod';
import {
  SEPARATOR_INTENTS,
  SEPARATOR_LINE_STYLES,
  SEPARATOR_ORIENTATIONS,
  SEPARATOR_POSITIONS,
  SEPARATOR_SIZES,
} from '../../core/shell-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';

export const separatorSchema = z.strictObject({
  label: labelSchema.optional(),
  children: childrenSchema,
  orientation: z.enum(SEPARATOR_ORIENTATIONS).optional(),
  position: z.enum(SEPARATOR_POSITIONS).optional(),
  lineStyle: z.enum(SEPARATOR_LINE_STYLES).optional(),
  intent: z.enum(SEPARATOR_INTENTS).optional(),
  size: z.enum(SEPARATOR_SIZES).optional(),
  decorative: z.boolean().optional(),
});
