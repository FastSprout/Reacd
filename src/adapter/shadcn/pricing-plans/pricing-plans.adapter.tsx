import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/pricing-plans/pricing-plans.adapter.js';
import { SharedPricingPlans } from
  '../../shared/pricing-plans/pricing-plans.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPricingPlansProps = ComponentProps<typeof SharedPricingPlans>;
export const ShadcnPricingPlans: ComponentType<ShadcnPricingPlansProps> =
  bindPrimitives(SharedPricingPlans, shadcnPrimitives, 'ShadcnPricingPlans');
