import { Children } from 'react';
import type { PricingPlansProps } from
  '@fastsprout/reacd/adapter-runtime/components/pricing-plans/pricing-plans.props.js';
import { PRICING_DEFAULTS as DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { CardContent } from '../vendor/ui/card.js';
import { ShadcnPricingPlan } from '../pricing-plan/pricing-plan.adapter.js';
import { PricingScaleContext } from '../pricing-plan/scale-context.js';

export type ShadcnPricingPlansProps = PricingPlansProps;
export function ShadcnPricingPlans({
  plans = DEFAULTS.entries,
  children,
  orientation = DEFAULTS.collectionOrientation,
  compact = DEFAULTS.compact,
  scale = DEFAULTS.scale,
}: PricingPlansProps) {
  const track = PAGE_PRESENTATION_POLICY.contentTrackRem;
  return (
    <PricingScaleContext value={scale}>
      <CardContent
        role="list"
        className="grid min-w-0 p-0"
        style={{
          gap: compact ? 'var(--space-small)' : 'var(--space-medium)',
          overflowWrap: 'anywhere',
          gridTemplateColumns:
            orientation === 'horizontal'
              ? `repeat(auto-fit, minmax(min(100%, ${track}rem), 1fr))`
              : 'minmax(0, 1fr)',
        }}
      >
        {plans.map(({ key, ...plan }) => (
          <CardContent key={key} role="listitem" className="min-w-0 p-0">
            <ShadcnPricingPlan {...plan} />
          </CardContent>
        ))}
        {Children.map(Children.toArray(children), (child) => (
          <CardContent role="listitem" className="min-w-0 p-0">
            {child}
          </CardContent>
        ))}
      </CardContent>
    </PricingScaleContext>
  );
}
