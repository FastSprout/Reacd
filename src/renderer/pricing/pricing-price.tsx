import type { ReactNode } from 'react';
import type { PricingPlanProps }
  from '../../components/pricing-plan/pricing-plan.props.js';

export function PricingPrice({
  price,
  discount,
  billingCycle,
  billingPeriod,
}: Pick<
  PricingPlanProps,
  'price' | 'discount' | 'billingCycle' | 'billingPeriod'
>): ReactNode {
  return (
    <div className="reacd-pricing-price">
      {price !== undefined &&
        (discount === undefined ? (
          <strong>{price}</strong>
        ) : (
          <>
            <s>{price}</s>
            <strong>{discount}</strong>
          </>
        ))}
      {billingCycle !== undefined && <span>{billingCycle}</span>}
      {billingPeriod !== undefined && <p>{billingPeriod}</p>}
    </div>
  );
}
