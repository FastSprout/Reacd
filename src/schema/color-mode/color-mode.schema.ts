import { z } from 'zod';
import { COLOR_MODES, RESOLVED_COLOR_MODES } from '../../core/color-mode-policy.js';
import type { ColorMode } from '../../core/color-mode-policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const colorModeValueSchema = z.enum(COLOR_MODES);
export const resolvedColorModeSchema = z.enum(RESOLVED_COLOR_MODES);
export const colorModeChangeSchema = z.custom<(value: ColorMode) => void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
export const colorModeControlProperties = {
  label: labelSchema,
  description: textSchema.optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
};
export const colorModeControlShape = {
  ...colorModeControlProperties,
  value: colorModeValueSchema,
  resolvedMode: resolvedColorModeSchema,
  onValueChange: colorModeChangeSchema,
};
