import { z } from 'zod';
import { SLIDER_POLICY } from '../../core/slider-policy.js';
import {
  hasSliderPrecision,
  hasSliderRangePrecision,
} from '../../core/slider-numeric.js';
import { numberRangeSchema } from '../number-range/index.js';

export const sliderScalarSchema = z
  .number()
  .finite()
  .refine(hasSliderPrecision, SLIDER_POLICY.unsupportedPrecisionMessage);
export const sliderIntervalSchema = numberRangeSchema.refine(
  hasSliderRangePrecision,
  SLIDER_POLICY.unsupportedPrecisionMessage,
);
