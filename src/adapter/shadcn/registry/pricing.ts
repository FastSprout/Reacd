import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { pricingPlanSchema } from '../../../schema/pricing-plan/pricing-plan.schema.js';
import { ShadcnPricingPlan } from '../pricing-plan/pricing-plan.adapter.js';
import { pricingPlansSchema }
  from '../../../schema/pricing-plans/pricing-plans.schema.js';
import { ShadcnPricingPlans } from '../pricing-plans/pricing-plans.adapter.js';
import { pricingTableSchema }
  from '../../../schema/pricing-table/pricing-table.schema.js';
import { ShadcnPricingTable } from '../pricing-table/pricing-table.adapter.js';

export const pricingEntries = {
  PricingPlan: renderEntry('PricingPlan', pricingPlanSchema, ShadcnPricingPlan),
  PricingPlans: renderEntry('PricingPlans', pricingPlansSchema, ShadcnPricingPlans),
  PricingTable: renderEntry('PricingTable', pricingTableSchema, ShadcnPricingTable),
};
