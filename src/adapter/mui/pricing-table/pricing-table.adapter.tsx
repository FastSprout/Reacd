import type { ComponentProps, ComponentType } from 'react';
import { SharedPricingTable } from
  '../../shared/pricing-table/pricing-table.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPricingTableProps = ComponentProps<typeof SharedPricingTable>;
export const MuiPricingTable: ComponentType<MuiPricingTableProps> = bindPrimitives(
  SharedPricingTable,
  muiPrimitives,
  'MuiPricingTable',
);
