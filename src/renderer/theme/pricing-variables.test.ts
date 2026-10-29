import { expect, it } from 'vitest';
import { PRICING_POLICY } from '../../core/pricing-policy.js';
import { pricingVariables } from './pricing-variables.js';

it('keeps prominence in the named core policy', () => {
  expect(pricingVariables()).toEqual({
    '--reacd-pricing-prominence': PRICING_POLICY.prominenceRatio,
  });
});
