import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/pricing-plan/pricing-plan.adapter.js';
import { SharedPricingPlan } from '../../shared/pricing-plan/pricing-plan.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPricingPlanProps = ComponentProps<typeof SharedPricingPlan>;
export const ShadcnPricingPlan: ComponentType<ShadcnPricingPlanProps> = bindPrimitives(
  SharedPricingPlan,
  shadcnPrimitives,
  'ShadcnPricingPlan',
);
