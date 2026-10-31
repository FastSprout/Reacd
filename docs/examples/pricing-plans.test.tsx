import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PricingPlansExample } from './pricing-plans.js';

it('runs the closed PricingPlans reference example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PricingPlansExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
