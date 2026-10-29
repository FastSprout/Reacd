import { SLIDER_POLICY } from '../../core/slider-policy.js';
import { hasSliderRangePrecision } from '../../core/slider-numeric.js';
import { boundedNumberRangeSchema } from '../number-range/index.js';
import { sliderScalarSchema } from './numeric.schema.js';
import { sliderBoundsSchema } from './properties.schema.js';

export function sliderNumberSchema(options: {
  readonly min: number;
  readonly max: number;
}) {
  const bounds = sliderBoundsSchema.parse(options);
  return sliderScalarSchema.min(bounds.min).max(bounds.max);
}

export function sliderRangeSchema(options: {
  readonly min: number;
  readonly max: number;
}) {
  const bounds = sliderBoundsSchema.parse(options);
  return boundedNumberRangeSchema(bounds).refine(
    hasSliderRangePrecision,
    SLIDER_POLICY.unsupportedPrecisionMessage,
  );
}
