import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/pricing-table/pricing-table.adapter.js';
import { SharedPricingTable } from
  '../../shared/pricing-table/pricing-table.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPricingTableProps = ComponentProps<typeof SharedPricingTable>;
export const ShadcnPricingTable: ComponentType<ShadcnPricingTableProps> =
  bindPrimitives(SharedPricingTable, shadcnPrimitives, 'ShadcnPricingTable');
