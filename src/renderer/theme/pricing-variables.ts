import { PRICING_POLICY } from '../../core/pricing-policy.js';

export function pricingVariables() {
  return { '--reacd-pricing-prominence': PRICING_POLICY.prominenceRatio };
}
