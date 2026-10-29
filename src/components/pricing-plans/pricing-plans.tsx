import type { ReactNode } from 'react';
import type { PricingPlansProps } from './pricing-plans.props.js';
import { pricingPlansSchema } from '../../schema/pricing-plans/pricing-plans.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PricingPlansProps } from './pricing-plans.props.js';
export function PricingPlans(props: PricingPlansProps): ReactNode {
  return useDeclaration('PricingPlans', pricingPlansSchema, props);
}
