import { z } from 'zod';
import { LOCALE_SELECT_POLICY } from '../../core/locale-select-policy.js';
import { isCanonicalLocale } from '../../core/locale-select.js';
import { labelSchema, textSchema, textChangeSchema } from '../shared/values.js';

export const localeCodeSchema = z
  .string()
  .max(LOCALE_SELECT_POLICY.maximumCodeLength)
  .regex(LOCALE_SELECT_POLICY.codePattern)
  .refine(isCanonicalLocale, 'Use a canonical BCP 47 locale code.');
export const localeItemSchema = z
  .strictObject({
    code: localeCodeSchema,
    label: labelSchema,
  })
  .readonly();
export const localeItemsSchema = z
  .array(localeItemSchema)
  .min(LOCALE_SELECT_POLICY.minimumLocales)
  .max(LOCALE_SELECT_POLICY.maximumLocales)
  .refine(
    (items) => new Set(items.map((item) => item.code)).size === items.length,
    'Locale codes must be unique.',
  )
  .readonly();

export function localeValueSchema(locales: readonly { code: string }[]) {
  return localeCodeSchema.refine(
    (value) => locales.some((item) => item.code === value),
    'The selected locale must exist in the locale list.',
  );
}

export const localeSelectProperties = {
  label: labelSchema,
  locales: localeItemsSchema,
  description: textSchema.optional(),
  name: labelSchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
};
export const localeSelectSchema = z
  .strictObject({
    ...localeSelectProperties,
    value: localeCodeSchema,
    onValueChange: textChangeSchema,
  })
  .refine(
    (properties) => properties.locales.some((item) => item.code === properties.value),
    'The selected locale must exist in the locale list.',
  );
