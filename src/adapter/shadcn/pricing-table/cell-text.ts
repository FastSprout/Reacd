import { PRICING_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';

export function pricingCellText(value: string | number | boolean | undefined): string {
  if (value === undefined) throw new Error('Pricing comparison cell is missing.');
  if (typeof value === 'boolean') {
    return value ? PRICING_DEFAULTS.included : PRICING_DEFAULTS.excluded;
  }
  return String(value);
}
