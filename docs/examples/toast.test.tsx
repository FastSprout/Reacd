import { chooseOption } from '../../test-support/select-choice.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ToastExample } from './toast.js';
it('runs documented notification workflows', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ToastExample />
    </ReacdProvider>,
  );
  await user.clear(screen.getByRole('textbox', { name: 'Notification title' }));
  await user.type(
    screen.getByRole('textbox', { name: 'Notification title' }),
    'Local sample notice',
  );
  for (const label of ['Normal', 'Long', 'Persistent']) {
    await chooseOption(user, 'Notification duration', label);
  }
  await user.click(screen.getByRole('button', { name: 'Show notification' }));
  await user.click(await screen.findByRole('button', { name: 'Undo sample update' }));
  expect(screen.getByText('Sample update undone.')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await user.click(screen.getByRole('button', { name: 'Show two notifications' }));
  fireEvent.keyDown(window, { key: 'F6' });
  const background = await screen.findByRole('dialog', {
    name: 'Background export ready',
  });
  background.focus();
  fireEvent.keyDown(background, { key: 'Escape' });
  const notice = screen.getByRole('dialog', { name: 'Local sample notice' });
  notice.focus();
  fireEvent.keyDown(notice, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await user.click(screen.getByRole('switch', { name: 'Keep notification open' }));
  await user.click(screen.getByRole('switch', { name: 'Urgent notification' }));
  await user.click(screen.getByRole('button', { name: 'Show notification' }));
  fireEvent.keyDown(window, { key: 'F6' });
  const toast = await screen.findByRole('alertdialog', { name: 'Local sample notice' });
  toast.focus();
  await user.keyboard('{Escape}');
  expect(toast).toHaveTextContent('The notification change was rejected.');
});
