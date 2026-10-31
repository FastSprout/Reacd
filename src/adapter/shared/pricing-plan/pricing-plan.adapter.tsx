import { useContext, useId } from 'react';
import type { ReactNode } from 'react';
import type { PricingPlanProps } from
  '@fastsprout/reacd/adapter-runtime/components/pricing-plan/pricing-plan.props.js';
import { PRICING_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import { PageHeading } from
  '@fastsprout/reacd/adapter-runtime/renderer/page-introduction/page-heading.js';
import { PricingScaleContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/pricing/scale-context.js';
import { PricingPrice } from
  '@fastsprout/reacd/adapter-runtime/renderer/pricing/pricing-price.js';

export function SharedPricingPlan({
  title,
  description,
  price,
  discount,
  billingCycle,
  billingPeriod,
  tagline,
  terms,
  badge,
  button,
  header,
  children,
  footer,
  features = PRICING_DEFAULTS.entries,
  orientation = PRICING_DEFAULTS.orientation,
  variant = PRICING_DEFAULTS.variant,
  highlight = PRICING_DEFAULTS.highlight,
  scale,
}: PricingPlanProps): ReactNode {
  const inheritedScale = useContext(PricingScaleContext);
  const level = useContext(HeadingLevelContext);
  const id = useId();
  const descendantLevel = title === undefined ? level : nextHeadingLevel(level);
  return (
    <article
      className="reacd-node reacd-pricing-plan"
      data-orientation={orientation}
      data-variant={variant}
      data-highlight={highlight}
      data-scale={scale ?? inheritedScale}
      aria-labelledby={title === undefined ? undefined : id}
    >
      <div className="reacd-pricing-introduction">
        <HeadingLevelContext.Provider value={descendantLevel}>
          {header}
        </HeadingLevelContext.Provider>
        {tagline !== undefined && <p>{tagline}</p>}
        <HeadingLevelContext.Provider value={descendantLevel}>
          {badge}
        </HeadingLevelContext.Provider>
        <PageHeading title={title} id={id} />
        {description !== undefined && <p>{description}</p>}
        <PricingPrice
          price={price}
          discount={discount}
          billingCycle={billingCycle}
          billingPeriod={billingPeriod}
        />
      </div>
      <div className="reacd-pricing-details">
        <HeadingLevelContext.Provider value={descendantLevel}>
          <ul className="reacd-pricing-features">
            {features.map((feature, index) =>
              typeof feature === 'string' ? (
                <li key={`label:${index}`}>{feature}</li>
              ) : (
                <li key={`feature:${feature.key}`}>
                  {feature.leading}
                  {feature.title}
                </li>
              ),
            )}
          </ul>
          {children}
          {button}
          {terms !== undefined && <p>{terms}</p>}
          {footer}
        </HeadingLevelContext.Provider>
      </div>
    </article>
  );
}
