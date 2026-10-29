import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PricingTable } from './pricing-table.js';
import type { PricingTableProps } from './pricing-table.props.js';

it('exposes a named closed PricingTable contract', () => {
  expectTypeOf<Parameters<typeof PricingTable>[0]>().toEqualTypeOf<PricingTableProps>();
  expectTypeOf<ReturnType<typeof PricingTable>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof PricingTableProps>
  >().toBeNever();
});
