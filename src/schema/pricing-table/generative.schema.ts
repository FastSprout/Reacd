import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { PRICING_POLICY } from '../../core/pricing-policy.js';
import {
  pricingTableSchema,
  pricingTableShape,
  pricingTierSchema,
  validPricingMatrix,
} from './pricing-table.schema.js';
import { validPricingDiscount } from '../pricing-plan/pricing-plan.schema.js';

export interface PricingTableTierNode<Content> extends Omit<
  z.infer<typeof pricingTierSchema>,
  'badge' | 'button'
> {
  badge?: Content[] | undefined;
  button?: Content[] | undefined;
}
export interface PricingTableNode<Content> extends Omit<
  z.infer<typeof pricingTableSchema>,
  'tiers'
> {
  type: 'PricingTable';
  tiers: readonly PricingTableTierNode<Content>[];
}

export function pricingTableNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const tier = z
    .strictObject({
      ...pricingTierSchema.shape,
      badge: slot.optional(),
      button: slot.optional(),
    })
    .refine(validPricingDiscount, 'A discounted price requires the original price.');
  return z
    .strictObject({
      ...pricingTableShape,
      type: z.literal('PricingTable'),
      tiers: z
        .array(tier)
        .min(PRICING_POLICY.minimumTiers)
        .max(PRICING_POLICY.maximumTiers)
        .readonly(),
    })
    .refine(
      validPricingMatrix,
      'Provide unique identifiers and a complete tier matrix.',
    );
}
