import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DashboardExample } from './dashboard.js';
import { installLayout } from '../../test-support/layout-observer.js';

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

it('navigates sample orders and retains notes through sidebar collapse', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('table', { name: 'Recent orders' })).toBeVisible();
  const note = screen.getByRole('textbox', { name: 'Workspace note' });
  fireEvent.change(note, { target: { value: 'Follow up with Ada.' } });
  await user.click(screen.getByRole('button', { name: 'Orders' }));
  expect(screen.queryByText('3 orders')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Overview' }));
  expect(screen.getByText('3 orders')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Create draft order' }));
  expect(screen.getByText('Draft order created in this preview.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
  await user.click(screen.getByRole('button', { name: 'Expand workspace' }));
  expect(note).toHaveValue('Follow up with Ada.');
});

it('runs searchable workspace actions and restores focus', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardExample />
    </ReacdProvider>,
  );
  const search = screen.getByRole('button', { name: 'Search dashboard' });
  await user.click(search);
  await user.type(screen.getByRole('combobox', { name: 'Search workspace' }), 'orders');
  await user.click(screen.getByRole('option', { name: 'View orders' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await user.click(search);
  await user.clear(screen.getByRole('combobox', { name: 'Search workspace' }));
  await user.click(screen.getByRole('option', { name: 'Create draft order' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByText('Draft order created in this preview.')).toBeVisible();
});
