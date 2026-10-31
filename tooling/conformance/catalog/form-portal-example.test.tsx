import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { FormPortalExample } from './form-portal-example.js';

it('isolates a real Modal portal submission from its ancestor Form', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <FormPortalExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Open portal form example' }));
  const portal = await screen.findByRole('form', { name: 'Inner portal example' });
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(within(portal).getByRole('button', { name: 'Submit inner portal' }));
  await user.keyboard('{Escape}');
  await screen.findByRole('button', { name: 'Open portal form example' });
  expect(screen.getByText('Inner submissions: 1')).toBeVisible();
  expect(screen.getByText('Outer submissions: 0')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Submit outer portal' }));
  expect(screen.getByText('Outer submissions: 1')).toBeVisible();
  expect(screen.getByText('Inner submissions: 1')).toBeVisible();
});
