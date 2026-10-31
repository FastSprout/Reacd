import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { FormExample } from './form.js';

it('runs retryable summaries and protected form state', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <FormExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Submit project' }));
  await user.click(screen.getByRole('button', { name: 'Submit project' }));
  expect(screen.getByText('Submission attempts: 2')).toBeVisible();
  expect(screen.getByRole('alert')).toHaveTextContent('Retry is available.');
  await user.click(screen.getByRole('button', { name: 'Clear form summary' }));
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Add retryable summary' }));
  expect(screen.getByRole('alert')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Form is submitting' }));
  expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true');
  await user.click(screen.getByRole('switch', { name: 'Form is submitting' }));
  await user.click(screen.getByRole('switch', { name: 'Disable project form' }));
  expect(screen.getByRole('textbox')).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable project form' }));
  await user.click(screen.getByRole('button', { name: 'Clear project name' }));
  await user.click(screen.getByRole('button', { name: 'Restore project name' }));
  expect(screen.getByRole('textbox')).toHaveValue('Local project');
  await user.click(screen.getByRole('switch', { name: 'Right to left project form' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left project form' }));
});
