import { PRICING_DEFAULTS } from '../../core/pricing-policy.js';

export function pricingValue(value: string | number | boolean | undefined): string {
  if (value === undefined) return PRICING_DEFAULTS.unavailable;
  return typeof value === 'boolean'
    ? value
      ? PRICING_DEFAULTS.included
      : PRICING_DEFAULTS.excluded
    : String(value);
}
