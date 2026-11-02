import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { RevenueCard } from './revenue.js';
import { SavingsCard } from './savings.js';
import { TransactionsCard } from './transactions.js';
import { VisitorsCard } from './visitors.js';

it('renders transaction values and accessible weekly visitor data', () => {
  render(
    <ReacdProvider>
      <TransactionsCard />
      <VisitorsCard />
    </ReacdProvider>,
  );
  expect(screen.getByRole('table', { name: 'Recent account activity' })).toBeVisible();
  expect(screen.getByRole('cell', { name: 'Project payout' })).toBeVisible();
  expect(screen.getByRole('cell', { name: '+$2,400.00' })).toBeVisible();
  expect(screen.getByRole('img', { name: 'Weekly visitors' })).toBeVisible();
  expect(screen.getByRole('table', { name: 'Weekly visitors data' })).toBeVisible();
});

it('updates bounded revenue and savings goals through real controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <RevenueCard />
      <SavingsCard />
    </ReacdProvider>,
  );
  const revenue = screen.getByRole('progressbar', { name: 'Monthly revenue goal' });
  expect(revenue).toHaveAttribute('aria-valuenow', '75');
  const update = screen.getByRole('button', { name: 'Advance monthly goal' });
  for (let index = 0; index < 5; index += 1) await user.click(update);
  expect(revenue).toHaveAttribute('aria-valuenow', '100');
  expect(update).toBeDisabled();
  const savings = screen.getByRole('progressbar', { name: 'Savings allocation' });
  expect(savings).toHaveAttribute('aria-valuenow', '9700');
  const contribute = screen.getByRole('button', { name: 'Contribute to savings' });
  for (let index = 0; index < 3; index += 1) await user.click(contribute);
  expect(savings).toHaveAttribute('aria-valuenow', '10000');
  expect(contribute).toBeDisabled();
});
