import { z } from 'zod';
import { PROGRESS_POLICY } from '../../core/element-policy.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const progressMaximumSchema = z
  .number()
  .finite()
  .positive()
  .max(PROGRESS_POLICY.maximumMagnitude);
export const progressValueSchema = z
  .number()
  .finite()
  .min(0)
  .max(PROGRESS_POLICY.maximumMagnitude)
  .nullable()
  .optional();
export function boundedProgressValueSchema(max: number = PROGRESS_POLICY.max) {
  const maximum = progressMaximumSchema.parse(max);
  return progressValueSchema.refine(
    (value) => value === null || value === undefined || value <= maximum,
    'Progress must be empty or within its maximum.',
  );
}

export const progressSchema = z
  .strictObject({
    label: labelSchema,
    value: progressValueSchema,
    max: progressMaximumSchema.optional(),
    description: textSchema.optional(),
    showValue: z.boolean().optional(),
  })
  .refine(
    (properties) =>
      properties.value === null ||
      properties.value === undefined ||
      properties.value <= (properties.max ?? PROGRESS_POLICY.max),
    'Progress value must be within its maximum.',
  );
