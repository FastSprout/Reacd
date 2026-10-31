import type { ComponentProps, ComponentType } from 'react';
import { SharedPricingPlans } from
  '../../shared/pricing-plans/pricing-plans.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPricingPlansProps = ComponentProps<typeof SharedPricingPlans>;
export const MuiPricingPlans: ComponentType<MuiPricingPlansProps> = bindPrimitives(
  SharedPricingPlans,
  muiPrimitives,
  'MuiPricingPlans',
);
