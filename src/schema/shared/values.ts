import { z } from 'zod';
import { CONTENT_POLICY, SPACING } from '../../core/policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';

export const labelSchema = z.string().trim().min(1).max(CONTENT_POLICY.maxLabelLength);
export const textSchema = z.string().max(CONTENT_POLICY.maxTextLength);
export const spacingSchema = z.enum(SPACING).optional();
export const disabledSchema = z.boolean().optional();
export const pressSchema = z.custom<() => void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
export const textChangeSchema = z.custom<(value: string) => void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
export const booleanChangeSchema = z.custom<(value: boolean) => void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
export const numberChangeSchema = z.custom<(value: number) => void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
