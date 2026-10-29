import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { pricingPlansSchema } from './pricing-plans.schema.js';
import { pricingPlanNodeSchema } from '../pricing-plan/generative.schema.js';
import type { PricingPlanNode } from '../pricing-plan/generative.schema.js';
import {
  uniquePricingPlanKeys,
  validPricingDiscount,
} from '../pricing-plan/pricing-plan.schema.js';
import { identifierSchema } from '../shared/identifier.js';

export interface PricingPlansNode<Content> extends Omit<
  z.infer<typeof pricingPlansSchema>,
  'plans' | 'children'
> {
  type: 'PricingPlans';
  plans?:
    readonly (Omit<PricingPlanNode<Content>, 'type'> & { key: string })[] | undefined;
  children: Content[];
}

export function pricingPlansNodeSchema<Content>(content: z.ZodType<Content>) {
  const { type: _type, ...plan } = pricingPlanNodeSchema(content).shape;
  const item = z
    .strictObject({ ...plan, key: identifierSchema })
    .refine(validPricingDiscount, 'A discounted price requires the original price.');
  return z.strictObject({
    ...pricingPlansSchema.shape,
    type: z.literal('PricingPlans'),
    plans: z
      .array(item)
      .max(DOCUMENT_POLICY.maxChildren)
      .refine(uniquePricingPlanKeys, 'Plan keys must be unique.')
      .readonly()
      .optional(),
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}
