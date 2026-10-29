import type { NumberRange } from './number-range.js';
import { SLIDER_POLICY } from './slider-policy.js';

interface NumericBounds {
  readonly min: number;
  readonly max: number;
}

export function hasSliderPrecision(value: number): boolean {
  return (
    Number.isFinite(value) &&
    Number(value.toFixed(SLIDER_POLICY.maximumFractionDigits)) === value
  );
}

export function hasSliderRangePrecision(value: NumberRange): boolean {
  return hasSliderPrecision(value.start) && hasSliderPrecision(value.end);
}

export function validSliderBounds(bounds: NumericBounds): boolean {
  const span = bounds.max - bounds.min;
  return (
    hasSliderPrecision(bounds.min) &&
    hasSliderPrecision(bounds.max) &&
    span > 0 &&
    Number.isFinite(span) &&
    Number.isFinite(span * SLIDER_POLICY.percentScale)
  );
}

export function validSliderNumbers(
  properties: NumericBounds & { readonly step?: number | undefined },
): boolean {
  if (!validSliderBounds(properties)) return false;
  const step = properties.step ?? SLIDER_POLICY.defaultStep;
  const span = properties.max - properties.min;
  return (
    hasSliderPrecision(step) &&
    step > 0 &&
    Number.isFinite(span / step) &&
    (step >= span ||
      (properties.min + step > properties.min &&
        properties.max - step < properties.max))
  );
}
