import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pricingPlanSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pricing-plan/pricing-plan.schema.js';
import { MuiPricingPlan } from '../pricing-plan/pricing-plan.adapter.js';
import { pricingPlansSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pricing-plans/pricing-plans.schema.js';
import { MuiPricingPlans } from '../pricing-plans/pricing-plans.adapter.js';
import { pricingTableSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pricing-table/pricing-table.schema.js';
import { MuiPricingTable } from '../pricing-table/pricing-table.adapter.js';

export const pricingEntries = {
  PricingPlan: renderEntry('PricingPlan', pricingPlanSchema, MuiPricingPlan),
  PricingPlans: renderEntry('PricingPlans', pricingPlansSchema, MuiPricingPlans),
  PricingTable: renderEntry('PricingTable', pricingTableSchema, MuiPricingTable),
};
