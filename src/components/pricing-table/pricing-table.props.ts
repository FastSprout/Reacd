import type { z } from 'zod';
import type { pricingTableSchema }
  from '../../schema/pricing-table/pricing-table.schema.js';

export type PricingTableProps = z.infer<typeof pricingTableSchema>;
