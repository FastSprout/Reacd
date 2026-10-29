import type { z } from 'zod';
import type { pricingPlansSchema }
  from '../../schema/pricing-plans/pricing-plans.schema.js';

export type PricingPlansProps = z.infer<typeof pricingPlansSchema>;
