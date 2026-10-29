import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PricingPlan } from './pricing-plan.js';
import type { PricingPlanProps } from './pricing-plan.props.js';

it('exposes a named closed PricingPlan contract', () => {
  expectTypeOf<Parameters<typeof PricingPlan>[0]>().toEqualTypeOf<PricingPlanProps>();
  expectTypeOf<ReturnType<typeof PricingPlan>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof PricingPlanProps>
  >().toBeNever();
});
