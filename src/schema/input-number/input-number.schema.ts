import { z } from 'zod';
import {
  INPUT_NUMBER_POLICY,
  NUMBER_FORMAT_STYLES,
} from '../../core/input-number-policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const numericValueSchema = z
  .number()
  .finite()
  .min(INPUT_NUMBER_POLICY.minimum)
  .max(INPUT_NUMBER_POLICY.maximum);
const fractionSchema = z
  .number()
  .int()
  .min(INPUT_NUMBER_POLICY.minFractionDigits)
  .max(INPUT_NUMBER_POLICY.maxFractionDigits);

export const numberFormatSchema = z
  .strictObject({
    style: z.enum(NUMBER_FORMAT_STYLES).optional(),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .optional(),
    minimumFractionDigits: fractionSchema.optional(),
    maximumFractionDigits: fractionSchema.optional(),
    useGrouping: z.boolean().optional(),
  })
  .refine((format) => {
    const currencyValid =
      format.style === 'currency'
        ? format.currency !== undefined
        : format.currency === undefined;
    return (
      currencyValid &&
      (format.minimumFractionDigits ?? INPUT_NUMBER_POLICY.minFractionDigits) <=
        (format.maximumFractionDigits ?? INPUT_NUMBER_POLICY.maxFractionDigits)
    );
  }, 'Invalid numeric format.');

export const numberLocaleSchema = labelSchema.refine((locale) => {
  try {
    return Intl.NumberFormat.supportedLocalesOf(locale).length > 0;
  } catch {
    return false;
  }
}, 'Unsupported numeric locale.');

export const inputNumberSchema = z
  .strictObject({
    label: labelSchema,
    description: textSchema.optional(),
    value: numericValueSchema.nullable(),
    onValueChange: z.custom<(value: number | null) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
    min: numericValueSchema.optional(),
    max: numericValueSchema.optional(),
    step: numericValueSchema.positive().optional(),
    locale: numberLocaleSchema.optional(),
    format: numberFormatSchema.optional(),
    placeholder: textSchema.optional(),
    name: stateKeySchema.optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    readOnly: z.boolean().optional(),
  })
  .refine((props) => {
    const min = props.min ?? INPUT_NUMBER_POLICY.minimum;
    const max = props.max ?? INPUT_NUMBER_POLICY.maximum;
    return (
      min <= max && (props.value === null || (props.value >= min && props.value <= max))
    );
  }, 'Value must be empty or within an ordered range.');
