import type { PricingPlanProps } from
  '@fastsprout/reacd/adapter-runtime/components/pricing-plan/pricing-plan.props.js';
import { CardContent, CardDescription, CardTitle } from '../vendor/ui/card.js';

type PriceProps = Pick<
  PricingPlanProps,
  'price' | 'discount' | 'billingCycle' | 'billingPeriod'
>;
export function ShadcnPlanPrice({
  price,
  discount,
  billingCycle,
  billingPeriod,
}: PriceProps) {
  return (
    <CardContent className="grid min-w-0 p-0 [overflow-wrap:anywhere]">
      {price &&
        (discount ? (
          <>
            <CardDescription style={{ textDecoration: 'line-through' }}>
              {price}
            </CardDescription>
            <CardTitle>{discount}</CardTitle>
          </>
        ) : (
          <CardTitle>{price}</CardTitle>
        ))}
      {billingCycle && <CardDescription>{billingCycle}</CardDescription>}
      {billingPeriod && <CardDescription>{billingPeriod}</CardDescription>}
    </CardContent>
  );
}
