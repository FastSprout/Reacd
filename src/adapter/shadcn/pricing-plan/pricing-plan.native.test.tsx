import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { PRICING_VARIANTS } from '../../../core/pricing-policy.js';
import { ShadcnPricingPlan } from './pricing-plan.adapter.js';
it('preserves all explicit pricing text and slots without calculations', () => {
  const child = <input aria-label="Draft" defaultValue="Saved" />;
  const view = render(
    <ShadcnPricingPlan
      title="Plan"
      description="Details"
      price="Original"
      discount="Discounted"
      billingCycle="Monthly"
      billingPeriod="Period"
      tagline="Tagline"
      terms="Terms"
      badge="Badge"
      button={<button>Select plan</button>}
      header="Header"
      footer="Footer"
      highlight
      scale
      features={['Basic', { key: 'one', title: 'Keyed', leading: 'Category' }]}
    >
      {child}
    </ShadcnPricingPlan>,
  );
  expect(screen.getByText('Original')).toHaveStyle('text-decoration: line-through');
  expect(screen.getByText('Discounted')).toBeVisible();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  const field = screen.getByRole('textbox');
  for (const variant of PRICING_VARIANTS) {
    view.rerender(
      <ShadcnPricingPlan
        title="Plan"
        variant={variant}
        price="Ordinary"
        orientation="horizontal"
      >
        {child}
      </ShadcnPricingPlan>,
    );
    expect(screen.getByRole('textbox')).toBe(field);
    expect(field).toHaveValue('Saved');
    expect(screen.getByText('Ordinary')).toBeVisible();
  }
  view.rerender(<ShadcnPricingPlan />);
  expect(screen.queryByRole('heading')).toBeNull();
  expect(screen.queryByRole('listitem')).toBeNull();
});
