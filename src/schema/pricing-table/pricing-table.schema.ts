import { z } from 'zod';
import { PRICING_POLICY } from '../../core/pricing-policy.js';
import {
  pricingPlanShape,
  validPricingDiscount,
} from '../pricing-plan/pricing-plan.schema.js';
import { identifierSchema } from '../shared/identifier.js';
import { labelSchema } from '../shared/values.js';

export const pricingTierSchema = z
  .strictObject({
    id: identifierSchema,
    title: labelSchema,
    description: pricingPlanShape.description,
    price: pricingPlanShape.price,
    discount: pricingPlanShape.discount,
    billingCycle: pricingPlanShape.billingCycle,
    billingPeriod: pricingPlanShape.billingPeriod,
    badge: pricingPlanShape.badge,
    button: pricingPlanShape.button,
    highlight: pricingPlanShape.highlight,
  })
  .refine(validPricingDiscount, 'A discounted price requires the original price.');

export const pricingTableFeatureSchema = z.strictObject({
  id: identifierSchema,
  title: labelSchema,
  tiers: z.record(
    identifierSchema,
    z.union([labelSchema, z.number().finite(), z.boolean()]),
  ),
});

export const pricingTableSectionSchema = z.strictObject({
  id: identifierSchema,
  title: labelSchema,
  features: z
    .array(pricingTableFeatureSchema)
    .max(PRICING_POLICY.maximumFeatures)
    .readonly(),
});

export const pricingTableShape = {
  caption: labelSchema,
  tiers: z
    .array(pricingTierSchema)
    .min(PRICING_POLICY.minimumTiers)
    .max(PRICING_POLICY.maximumTiers)
    .readonly(),
  sections: z
    .array(pricingTableSectionSchema)
    .max(PRICING_POLICY.maximumSections)
    .readonly(),
};

export function validPricingMatrix(value: {
  tiers: readonly { id: string }[];
  sections: readonly {
    id: string;
    features: readonly {
      id: string;
      tiers: Readonly<Record<string, unknown>>;
    }[];
  }[];
}): boolean {
  const tierIds = new Set(value.tiers.map((tier) => tier.id));
  const sectionIds = new Set(value.sections.map((section) => section.id));
  return (
    tierIds.size === value.tiers.length &&
    sectionIds.size === value.sections.length &&
    value.sections.every(
      (section) =>
        new Set(section.features.map((feature) => feature.id)).size ===
          section.features.length &&
        section.features.every((feature) => {
          const keys = Object.keys(feature.tiers);
          return keys.length === tierIds.size && keys.every((key) => tierIds.has(key));
        }),
    )
  );
}

export const pricingTableSchema = z
  .strictObject(pricingTableShape)
  .refine(validPricingMatrix, 'Provide unique identifiers and a complete tier matrix.');
