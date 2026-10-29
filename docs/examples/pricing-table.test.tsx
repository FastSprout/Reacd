import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { PricingTableExample } from './pricing-table.js';

it('runs the closed PricingTable reference example', () => {
  render(
    <ReacdProvider>
      <PricingTableExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
