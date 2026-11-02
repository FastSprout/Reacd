import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SelectMenuExample } from './select-menu.js';

it('chooses an assignee from the searchable menu', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <SelectMenuExample />
    </ReacdProvider>,
  );
  const assignee = screen.getByRole('combobox', { name: 'Assignee' });
  await user.click(assignee);
  await user.click(await screen.findByRole('option', { name: 'Leo Martin' }));
  await waitFor(() => expect(screen.queryByRole('option',
    { name: 'Leo Martin' })).toBeNull());
  await user.click(assignee);
  expect(await screen.findByRole('option', { name: 'Leo Martin' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
