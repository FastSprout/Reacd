import type { z } from 'zod';
import type { pricingPlanSchema }
  from '../../schema/pricing-plan/pricing-plan.schema.js';

export type PricingPlanProps = z.infer<typeof pricingPlanSchema>;
