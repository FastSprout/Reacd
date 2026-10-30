import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PricingPlanExample } from './pricing-plan.js';

it('runs the closed PricingPlan reference example', () => {
  render(
    <ReacdProvider>
      <PricingPlanExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
