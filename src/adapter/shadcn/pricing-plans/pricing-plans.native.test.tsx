import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPricingPlans } from './pricing-plans.adapter.js';
import { ShadcnPricingPlan } from '../pricing-plan/pricing-plan.adapter.js';
it('keeps keyed plans and explicit prominence overrides across reflow', () => {
  const plans = [
    {
      key: 'one',
      title: 'First',
      children: <input aria-label="Draft" defaultValue="Saved" />,
    },
    { key: 'two', title: 'Second', scale: false },
  ];
  const view = render(
    <ShadcnPricingPlans plans={plans} scale>
      <ShadcnPricingPlan title="Third" />
    </ShadcnPricingPlans>,
  );
  const field = screen.getByRole('textbox');
  expect(screen.getByRole('article', { name: 'First' }).style.paddingBlock).toContain(
    '1.25',
  );
  expect(screen.getByRole('article', { name: 'Second' }).style.paddingBlock).toBe('');
  expect(screen.getByRole('article', { name: 'Third' }).style.paddingBlock).toContain(
    '1.25',
  );
  view.rerender(
    <ShadcnPricingPlans plans={[...plans].reverse()} orientation="vertical" compact />,
  );
  expect(screen.getByRole('textbox')).toBe(field);
  expect(field).toHaveValue('Saved');
  view.rerender(<ShadcnPricingPlans />);
  expect(screen.queryByRole('listitem')).toBeNull();
});
