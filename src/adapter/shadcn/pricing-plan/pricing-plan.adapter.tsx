import { useContext } from 'react';
import type { PricingPlanProps } from
  '@fastsprout/reacd/adapter-runtime/components/pricing-plan/pricing-plan.props.js';
import {
  PRICING_DEFAULTS as DEFAULTS,
  PRICING_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/pricing-policy.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { nextHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/heading-policy.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from '../vendor/ui/card.js';
import { ShadcnProseHeading } from '../prose/typography.js';
import { ShadcnThemeContext } from '../surface/theme-context.js';
import { usePageSurface } from '../page-card/surface.js';
import { PricingScaleContext } from './scale-context.js';
import { ShadcnPlanPrice } from './price.js';

export type ShadcnPricingPlanProps = PricingPlanProps;
export function ShadcnPricingPlan({
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
  features = DEFAULTS.entries,
  orientation = DEFAULTS.orientation,
  variant = DEFAULTS.variant,
  highlight = DEFAULTS.highlight,
  scale,
}: PricingPlanProps) {
  const inheritedScale = useContext(PricingScaleContext);
  const prominent = scale ?? inheritedScale;
  const level = useContext(HeadingLevelContext);
  const surface = usePageSurface(variant, 'neutral', highlight);
  return (
    <ShadcnThemeContext value={surface.variables}>
      <Card
        role="article"
        aria-label={title}
        className={`min-w-0 ${surface.className}`}
        style={{
          ...surface.style,
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          paddingBlock: prominent
            ? `calc(var(--space-medium) * ${PRICING_POLICY.prominenceRatio})`
            : undefined,
        }}
      >
        <CardHeader className="min-w-0 max-w-full">
          {header}
          {badge}
          {tagline && <CardDescription>{tagline}</CardDescription>}
          {title && <ShadcnProseHeading level={level}>{title}</ShadcnProseHeading>}
          {description && <CardDescription>{description}</CardDescription>}
          <ShadcnPlanPrice
            price={price}
            discount={discount}
            billingCycle={billingCycle}
            billingPeriod={billingPeriod}
          />
        </CardHeader>
        <HeadingLevelContext value={title ? nextHeadingLevel(level) : level}>
          <CardContent className="grid min-w-0 max-w-full"
            style={{ gap: 'var(--space-medium)' }}>
            {features.length > 0 && (
              <CardContent role="list" className="grid min-w-0 p-0">
                {features.map((feature, index) => (
                  <CardDescription
                    role="listitem"
                    key={typeof feature === 'string' ? index : feature.key}
                  >
                    {typeof feature === 'string' ? (
                      feature
                    ) : (
                      <>
                        {feature.leading} {feature.title}
                      </>
                    )}
                  </CardDescription>
                ))}
              </CardContent>
            )}
            {children}
          </CardContent>
          <CardFooter className="min-w-0 max-w-full flex-col items-stretch">
            {terms && <CardDescription>{terms}</CardDescription>}
            {button}
            {footer}
          </CardFooter>
        </HeadingLevelContext>
      </Card>
    </ShadcnThemeContext>
  );
}
