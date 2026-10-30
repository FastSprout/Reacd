import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatToolExample } from './chat-tool.js';

it('runs simulated tool status, approval, rejection and retry', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatToolExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Example reference reader' }));
  const input = screen.getByRole('textbox', { name: 'Example tool output' });
  await user.clear(input);
  await user.type(input, '<script>Example data</script>');
  expect(screen.getByText('<script>Example data</script>')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Run example tool' }));
  expect(screen.getByText('Running', { exact: true })).toBeVisible();
  await user.click(
    screen.getByRole('button', { name: 'Request example tool approval' }),
  );
  await user.click(screen.getByRole('button', { name: 'Approve tool request' }));
  expect(screen.getByText('Approved example request.')).toBeVisible();
  expect(screen.getByText('Completed', { exact: true })).toBeVisible();
  await user.click(
    screen.getByRole('button', { name: 'Request example tool approval' }),
  );
  await user.click(screen.getByRole('button', { name: 'Reject tool request' }));
  expect(screen.getByText('Rejected example request.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Retry tool request' }));
  expect(screen.getByText('Pending', { exact: true })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Set example tool pending' }));
  await user.click(screen.getByRole('button', { name: 'Complete example tool' }));
  await user.click(screen.getByRole('button', { name: 'Fail example tool' }));
  await user.click(screen.getByRole('switch', { name: 'Protect tool actions' }));
  expect(screen.getByRole('button', { name: 'Retry tool request' })).toBeDisabled();
});
