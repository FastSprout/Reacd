import type { ReactNode } from 'react';
import type { PricingPlanProps } from './pricing-plan.props.js';
import { pricingPlanSchema } from '../../schema/pricing-plan/pricing-plan.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PricingPlanProps } from './pricing-plan.props.js';
export function PricingPlan(props: PricingPlanProps): ReactNode {
  return useDeclaration('PricingPlan', pricingPlanSchema, props);
}
