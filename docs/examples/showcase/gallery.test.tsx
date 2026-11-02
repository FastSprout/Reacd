import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ShowcaseExample } from '../showcase.js';

it('shows every reference landing feature family through real reacd components', () => {
  render(
    <ReacdProvider>
      <ShowcaseExample />
    </ReacdProvider>,
  );
  for (const name of [
    'People',
    'Quick actions',
    'Dates and calendar',
    'Recent transactions',
    'Visitors',
    'Verify your account',
    'Revenue',
    'Savings targets',
    'Shortcuts',
    'Workspace navigation',
    'Product update',
    'Contributors',
    'Login',
    'Chat',
  ])
    expect(screen.getByRole('region', { name })).toBeVisible();
});
