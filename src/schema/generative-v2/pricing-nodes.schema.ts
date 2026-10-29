import type { z } from 'zod';
import { pricingPlanNodeSchema } from '../pricing-plan/generative.schema.js';
import type { PricingPlanNode } from '../pricing-plan/generative.schema.js';
import { pricingPlansNodeSchema } from '../pricing-plans/generative.schema.js';
import type { PricingPlansNode } from '../pricing-plans/generative.schema.js';
import { pricingTableNodeSchema } from '../pricing-table/generative.schema.js';
import type { PricingTableNode } from '../pricing-table/generative.schema.js';

export type PricingNode<Content> =
  PricingPlanNode<Content> | PricingPlansNode<Content> | PricingTableNode<Content>;

export function pricingNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    pricingPlanNodeSchema(content),
    pricingPlansNodeSchema(content),
    pricingTableNodeSchema(content),
  ] as const;
}
