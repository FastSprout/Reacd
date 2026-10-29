import { z } from 'zod';
import { labelSchema, textSchema } from '../shared/values.js';
import {
  TOAST_INTENTS,
  TOAST_PRIORITIES,
  TOAST_DURATION_NAMES,
} from '../../core/toast-policy.js';
const decisionSchema = z.custom<() => boolean | void>(
  (value) => typeof value === 'function',
  'Action must be a function.',
);
export const toastChangeSchema = z.custom<(open: boolean) => boolean | void>(
  (value) => typeof value === 'function',
  'Open change must be a function.',
);
export const toastActionSchema = z.strictObject({
  label: labelSchema,
  onPress: decisionSchema,
});
export const toastSchema = z.strictObject({
  title: labelSchema,
  description: textSchema.optional(),
  open: z.boolean(),
  onOpenChange: toastChangeSchema,
  intent: z.enum(TOAST_INTENTS).optional(),
  priority: z.enum(TOAST_PRIORITIES).optional(),
  duration: z.enum(TOAST_DURATION_NAMES).optional(),
  closeLabel: labelSchema.optional(),
  closeOnAction: z.boolean().optional(),
  action: toastActionSchema.optional(),
});
