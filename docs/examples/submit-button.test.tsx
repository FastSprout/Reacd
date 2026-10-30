import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SubmitButtonExample } from './submit-button.js';

it('runs the SubmitButton public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SubmitButtonExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Approve sample' }));
  await user.click(screen.getByRole('button', { name: 'Approve sample' }));
  expect(screen.getByText('Approved samples: 2')).toBeVisible();
});
