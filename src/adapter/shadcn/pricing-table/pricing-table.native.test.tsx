import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPricingTable } from './pricing-table.adapter.js';
import { pricingCellText } from './cell-text.js';
it('uses native captioned comparison semantics and exact finite matrix values', () => {
  const view = render(
    <ShadcnPricingTable
      caption="Comparison"
      tiers={[
        {
          id: 'one',
          title: 'One',
          description: 'Details',
          price: 'Original',
          discount: 'Discount',
          billingCycle: 'Month',
          billingPeriod: 'Period',
          badge: 'Badge',
          button: <button>Choose</button>,
          highlight: true,
        },
        { id: 'two', title: 'Two', price: 'Price' },
        { id: 'three', title: 'Three' },
      ]}
      sections={[
        {
          id: 'features',
          title: 'Features',
          features: [
            {
              id: 'access',
              title: 'Access',
              tiers: { one: true, two: false, three: 0 },
            },
            { id: 'level', title: 'Level', tiers: { one: 'A', two: 2, three: 'C' } },
          ],
        },
      ]}
    />,
  );
  expect(screen.getByRole('region', { name: 'Comparison' })).toHaveAttribute(
    'tabindex',
    '0',
  );
  expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
  expect(screen.getByRole('cell', { name: 'Included' })).toBeVisible();
  expect(screen.getByRole('cell', { name: 'Not included' })).toBeVisible();
  expect(screen.getByRole('cell', { name: '0' })).toBeVisible();
  expect(screen.getByRole('rowheader', { name: 'Access' })).toBeVisible();
  expect(screen.getByText('Features')).toHaveAttribute('scope', 'rowgroup');
  expect(screen.getByRole('button', { name: 'Choose' })).toBeVisible();
  view.rerender(
    <ShadcnPricingTable
      caption="Empty"
      tiers={[{ id: 'one', title: 'One' }]}
      sections={[]}
    />,
  );
  expect(screen.queryByRole('cell')).toBeNull();
  expect(() => pricingCellText(undefined)).toThrow('missing');
});
