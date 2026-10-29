import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PricingPlans } from './pricing-plans.js';
import type { PricingPlansProps } from './pricing-plans.props.js';

it('exposes a named closed PricingPlans contract', () => {
  expectTypeOf<Parameters<typeof PricingPlans>[0]>().toEqualTypeOf<PricingPlansProps>();
  expectTypeOf<ReturnType<typeof PricingPlans>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof PricingPlansProps>
  >().toBeNever();
});
