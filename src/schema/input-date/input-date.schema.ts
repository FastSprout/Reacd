import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { orderedTemporalLimits, withinTemporalLimits } from '../../core/date-time.js';
import { INPUT_DATE_POLICY } from '../../core/input-date-policy.js';
import { dateValueSchema, dateRangeValueSchema } from '../date-time/index.js';
import { inputDateProperties } from './properties.schema.js';

const singleInputDateSchema = z
  .strictObject({
    ...inputDateProperties,
    mode: z.literal('single').optional(),
    value: dateValueSchema,
    onValueChange: z.custom<(value: string | null) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
  })
  .refine(
    (props) => orderedTemporalLimits(props) && withinTemporalLimits(props.value, props),
    INPUT_DATE_POLICY.invalidValue,
  );

const rangeInputDateSchema = z
  .strictObject({
    ...inputDateProperties,
    mode: z.literal('range'),
    value: dateRangeValueSchema(),
    onValueChange: z.custom<
      (value: Readonly<{ start: string | null; end: string | null }>) => void
    >((value) => typeof value === 'function', FRAMEWORK_ERRORS.invalidCallback),
  })
  .refine(
    (props) =>
      orderedTemporalLimits(props) &&
      withinTemporalLimits(props.value.start, props) &&
      withinTemporalLimits(props.value.end, props),
    INPUT_DATE_POLICY.invalidRange,
  );

export const inputDateSchema = z.discriminatedUnion('mode', [
  singleInputDateSchema,
  rangeInputDateSchema,
]);
