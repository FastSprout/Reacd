import { z } from 'zod';
import { colorModeControlShape } from '../color-mode/color-mode.schema.js';
import { consistentColorMode } from '../../core/color-mode.js';
import { COLOR_MODE_POLICY } from '../../core/color-mode-policy.js';
import { labelSchema } from '../shared/values.js';

export const colorModeSelectSchema = z
  .strictObject({
    ...colorModeControlShape,
    labels: z
      .strictObject({
        system: labelSchema,
        light: labelSchema,
        dark: labelSchema,
      })
      .optional(),
  })
  .refine(consistentColorMode, COLOR_MODE_POLICY.modeMismatch);
