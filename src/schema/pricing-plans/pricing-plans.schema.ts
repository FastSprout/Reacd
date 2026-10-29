import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { PAGE_ORIENTATIONS } from '../../core/page-presentation-policy.js';
import {
  pricingPlanShape,
  validPricingDiscount,
  uniquePricingPlanKeys,
} from '../pricing-plan/pricing-plan.schema.js';
import { identifierSchema } from '../shared/identifier.js';
import { childrenSchema } from '../shared/children.js';

export const pricingPlansItemSchema = z
  .strictObject({
    ...pricingPlanShape,
    key: identifierSchema,
  })
  .refine(validPricingDiscount, 'A discounted price requires the original price.');

export const pricingPlansSchema = z.strictObject({
  plans: z
    .array(pricingPlansItemSchema)
    .max(DOCUMENT_POLICY.maxChildren)
    .refine(uniquePricingPlanKeys, 'Plan keys must be unique.')
    .readonly()
    .optional(),
  orientation: z.enum(PAGE_ORIENTATIONS).optional(),
  compact: z.boolean().optional(),
  scale: z.boolean().optional(),
  children: childrenSchema,
});
