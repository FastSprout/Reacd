import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { orderedTemporalLimits, withinTemporalLimits } from '../../core/date-time.js';
import { INPUT_TIME_POLICY } from '../../core/input-time-policy.js';
import { timeValueSchema, timeRangeValueSchema } from '../date-time/index.js';
import { inputTimeProperties } from './properties.schema.js';

const singleInputTimeSchema = z
  .strictObject({
    ...inputTimeProperties,
    mode: z.literal('single').optional(),
    value: timeValueSchema,
    onValueChange: z.custom<(value: string | null) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
  })
  .refine(
    (props) => orderedTemporalLimits(props) && withinTemporalLimits(props.value, props),
    INPUT_TIME_POLICY.invalidValue,
  );

const rangeInputTimeSchema = z
  .strictObject({
    ...inputTimeProperties,
    mode: z.literal('range'),
    value: timeRangeValueSchema(),
    onValueChange: z.custom<
      (value: Readonly<{ start: string | null; end: string | null }>) => void
    >((value) => typeof value === 'function', FRAMEWORK_ERRORS.invalidCallback),
  })
  .refine(
    (props) =>
      orderedTemporalLimits(props) &&
      withinTemporalLimits(props.value.start, props) &&
      withinTemporalLimits(props.value.end, props),
    INPUT_TIME_POLICY.invalidRange,
  );

export const inputTimeSchema = z.discriminatedUnion('mode', [
  singleInputTimeSchema,
  rangeInputTimeSchema,
]);
