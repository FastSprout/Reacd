import { Children } from 'react';
import type { ReactNode } from 'react';
import type { PricingPlansProps }
  from '../../../components/pricing-plans/pricing-plans.props.js';
import { PricingPlan } from '../../../components/pricing-plan/pricing-plan.js';
import { PRICING_DEFAULTS } from '../../../core/pricing-policy.js';
import { PricingScaleContext } from '../../../renderer/pricing/scale-context.js';

export function ShadcnPricingPlans({
  children,
  plans = PRICING_DEFAULTS.entries,
  orientation = PRICING_DEFAULTS.collectionOrientation,
  compact = PRICING_DEFAULTS.compact,
  scale = PRICING_DEFAULTS.scale,
}: PricingPlansProps): ReactNode {
  return (
    <PricingScaleContext.Provider value={scale}>
      <ul
        className="reacd-node reacd-pricing-plans"
        data-orientation={orientation}
        data-compact={compact}
      >
        {plans.map(({ key, ...plan }) => (
          <li key={key}>
            <PricingPlan {...plan} />
          </li>
        ))}
        {Children.map(children, (child) => (child == null ? null : <li>{child}</li>))}
      </ul>
    </PricingScaleContext.Provider>
  );
}
