import { z } from 'zod';
import { colorModeControlShape } from '../color-mode/color-mode.schema.js';
import { consistentColorMode } from '../../core/color-mode.js';
import { COLOR_MODE_POLICY } from '../../core/color-mode-policy.js';

export const colorModeButtonSchema = z
  .strictObject({
    ...colorModeControlShape,
  })
  .refine(consistentColorMode, COLOR_MODE_POLICY.modeMismatch);
