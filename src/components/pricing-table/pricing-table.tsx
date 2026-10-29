import type { ReactNode } from 'react';
import type { PricingTableProps } from './pricing-table.props.js';
import { pricingTableSchema } from '../../schema/pricing-table/pricing-table.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PricingTableProps } from './pricing-table.props.js';
export function PricingTable(props: PricingTableProps): ReactNode {
  return useDeclaration('PricingTable', pricingTableSchema, props);
}
