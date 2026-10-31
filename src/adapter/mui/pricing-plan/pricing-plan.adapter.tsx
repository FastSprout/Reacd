import type { ComponentProps, ComponentType } from 'react';
import { SharedPricingPlan } from '../../shared/pricing-plan/pricing-plan.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPricingPlanProps = ComponentProps<typeof SharedPricingPlan>;
export const MuiPricingPlan: ComponentType<MuiPricingPlanProps> = bindPrimitives(
  SharedPricingPlan,
  muiPrimitives,
  'MuiPricingPlan',
);
