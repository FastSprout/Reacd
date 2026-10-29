import { z } from 'zod';
import { SLIDER_POLICY } from '../../core/slider-policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import type { NumberRange } from '../../core/number-range.js';
import { validSliderNumbers } from '../../core/slider-numeric.js';
import { sliderScalarSchema, sliderIntervalSchema } from './numeric.schema.js';
import { numberChangeSchema } from '../shared/values.js';
import { sliderPropertiesSchema } from './properties.schema.js';

const single = sliderPropertiesSchema
  .extend({
    mode: z.literal('single').optional(),
    value: sliderScalarSchema,
    onValueChange: numberChangeSchema,
  })
  .refine(
    (props) =>
      validSliderNumbers(props) && props.value >= props.min && props.value <= props.max,
    SLIDER_POLICY.invalidValueMessage,
  );
const range = sliderPropertiesSchema
  .extend({
    mode: z.literal('range'),
    value: sliderIntervalSchema,
    onValueChange: z.custom<(value: NumberRange) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
  })
  .refine(
    (props) =>
      validSliderNumbers(props) &&
      props.value.start >= props.min &&
      props.value.end <= props.max,
    SLIDER_POLICY.invalidValueMessage,
  );
export const sliderSchema = z.discriminatedUnion('mode', [single, range]);
