import { z } from 'zod';
import { PRICING_POLICY, PRICING_VARIANTS } from '../../core/pricing-policy.js';
import { PAGE_ORIENTATIONS } from '../../core/page-presentation-policy.js';
import { childrenSchema } from '../shared/children.js';
import { identifierSchema } from '../shared/identifier.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const pricingFeatureSchema = z.strictObject({
  key: identifierSchema,
  title: labelSchema,
  leading: childrenSchema,
});

export function uniquePricingFeatures(
  features: readonly (string | { key: string })[],
): boolean {
  const keys = features.flatMap((feature) =>
    typeof feature === 'string' ? [] : [feature.key],
  );
  return new Set(keys).size === keys.length;
}

export const pricingPlanShape = {
  title: labelSchema.optional(),
  description: textSchema.optional(),
  price: labelSchema.optional(),
  discount: labelSchema.optional(),
  billingCycle: labelSchema.optional(),
  billingPeriod: labelSchema.optional(),
  tagline: labelSchema.optional(),
  terms: textSchema.optional(),
  badge: childrenSchema,
  button: childrenSchema,
  header: childrenSchema,
  children: childrenSchema,
  footer: childrenSchema,
  features: z
    .array(z.union([labelSchema, pricingFeatureSchema]))
    .max(PRICING_POLICY.maximumFeatures)
    .refine(uniquePricingFeatures, 'Feature keys must be unique.')
    .readonly()
    .optional(),
  orientation: z.enum(PAGE_ORIENTATIONS).optional(),
  variant: z.enum(PRICING_VARIANTS).optional(),
  highlight: z.boolean().optional(),
  scale: z.boolean().optional(),
};

export function validPricingDiscount(value: {
  price?: string | undefined;
  discount?: string | undefined;
}): boolean {
  return value.discount === undefined || value.price !== undefined;
}

export function uniquePricingPlanKeys(plans: readonly { key: string }[]): boolean {
  return new Set(plans.map((plan) => plan.key)).size === plans.length;
}

export const pricingPlanSchema = z
  .strictObject(pricingPlanShape)
  .refine(validPricingDiscount, 'A discounted price requires the original price.');
