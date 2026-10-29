import { z } from 'zod';
import { CAROUSEL_ORIENTATIONS, CAROUSEL_POLICY } from '../../core/carousel-policy.js';
import { DATA_STATES } from '../../core/policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, pressSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const carouselSettingsSchema = z.strictObject({
  label: labelSchema,
  orientation: z.enum(CAROUSEL_ORIENTATIONS).optional(),
  loop: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  state: z.enum(DATA_STATES).optional(),
  emptyMessage: textSchema.optional(),
  loadingMessage: textSchema.optional(),
  errorMessage: textSchema.optional(),
  retryLabel: labelSchema.optional(),
});
export const carouselItemSchema = z.strictObject({
  id: stateKeySchema,
  label: labelSchema,
  children: childrenSchema,
});
export function carouselValueSchema(count: number) {
  return z
    .number()
    .int()
    .min(CAROUSEL_POLICY.emptyIndex)
    .max(Math.max(CAROUSEL_POLICY.emptyIndex, count - CAROUSEL_POLICY.step));
}
export const carouselSchema = carouselSettingsSchema
  .extend({
    items: z
      .array(carouselItemSchema)
      .max(CAROUSEL_POLICY.maxItems)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        'Carousel item identifiers must be unique.',
      )
      .readonly(),
    value: z.number().int().min(CAROUSEL_POLICY.emptyIndex),
    onValueChange: z.custom<(value: number) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
    onRetry: pressSchema.optional(),
  })
  .refine(
    (properties) =>
      carouselValueSchema(properties.items.length).safeParse(properties.value).success,
    'Carousel value must identify an existing slide.',
  );
