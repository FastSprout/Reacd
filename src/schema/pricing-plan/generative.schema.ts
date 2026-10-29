import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { PRICING_POLICY } from '../../core/pricing-policy.js';
import {
  pricingPlanSchema,
  pricingPlanShape,
  pricingFeatureSchema,
  uniquePricingFeatures,
  validPricingDiscount,
} from './pricing-plan.schema.js';
import { labelSchema } from '../shared/values.js';

export interface PricingFeatureNode<Content> {
  key: string;
  title: string;
  leading?: Content[] | undefined;
}
export interface PricingPlanNode<Content> extends Omit<
  z.infer<typeof pricingPlanSchema>,
  'children' | 'badge' | 'button' | 'header' | 'footer' | 'features'
> {
  type: 'PricingPlan';
  children: Content[];
  badge?: Content[] | undefined;
  button?: Content[] | undefined;
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
  features?: readonly (string | PricingFeatureNode<Content>)[] | undefined;
}

export function pricingPlanNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z
    .strictObject({
      ...pricingPlanShape,
      type: z.literal('PricingPlan'),
      children: slot,
      badge: slot.optional(),
      button: slot.optional(),
      header: slot.optional(),
      footer: slot.optional(),
      features: z
        .array(
          z.union([
            labelSchema,
            z.strictObject({
              ...pricingFeatureSchema.shape,
              leading: slot.optional(),
            }),
          ]),
        )
        .max(PRICING_POLICY.maximumFeatures)
        .refine(uniquePricingFeatures, 'Feature keys must be unique.')
        .readonly()
        .optional(),
    })
    .refine(validPricingDiscount, 'A discounted price requires the original price.');
}
