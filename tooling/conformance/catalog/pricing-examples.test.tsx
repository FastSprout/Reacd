import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PricingExamples } from './pricing-examples.js';

it('runs illustrative choices and preserves the local pricing draft', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PricingExamples />
    </ReacdProvider>,
  );
  const draft = screen.getByLabelText('Pricing plan draft');
  await user.type(draft, 'Retained plan draft');
  for (const name of [
    'Select illustrative plan',
    'Choose first reference plan',
    'Choose supplemental reference plan',
    'Choose comparison reference tier',
  ]) {
    await user.click(screen.getByRole('button', { name }));
  }
  expect(screen.getByText('Illustrative plan selected')).toBeVisible();
  expect(screen.getByText('Selected reference plan: Supplemental')).toBeVisible();
  expect(screen.getByText('Comparison reference tier selected')).toBeVisible();
  for (const name of [
    'Prominent example plan',
    'Vertical pricing collection',
    'Compact pricing collection',
    'Prominent collection plans',
    'Pricing RTL',
  ]) {
    await user.click(screen.getByRole('switch', { name }));
  }
  expect(draft).toHaveValue('Retained plan draft');
});
