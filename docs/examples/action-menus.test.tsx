import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { DropdownMenuExample } from './dropdown-menu.js';
import { ContextMenuExample } from './context-menu.js';
it('runs the documented dropdown choices, submenu and local action', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <DropdownMenuExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Record actions' }));
  await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Pin record' }));
  expect(screen.getByText('Record is pinned.')).toBeInTheDocument();
  await user.click(screen.getByRole('menuitemradio', { name: 'Compact' }));
  expect(screen.getByText('Density: compact')).toBeInTheDocument();
  await user.click(screen.getByRole('menuitem', { name: 'Share' }));
  const copy = await screen.findByRole('menuitem', {
    name: 'Copy record identifier',
  });
  await waitFor(() => expect(copy).not.toHaveStyle({ pointerEvents: 'none' }));
  fireEvent.click(copy);
  expect(screen.getByText('Record identifier copied locally.')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
});
it('runs the documented context actions with optional retained opening', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ContextMenuExample />
    </ReacdProvider>,
  );
  fireEvent.contextMenu(screen.getByRole('group', { name: 'Sample record context' }));
  await user.click(
    await screen.findByRole('menuitem', { name: 'Confirm sample record' }),
  );
  expect(screen.getByText('Sample record confirmed locally.')).toBeInTheDocument();
  expect(screen.getByRole('menu')).toBeVisible();
  await user.click(screen.getByRole('menuitem', { name: 'Archive sample record' }));
  expect(screen.getByText('Sample record archived locally.')).toBeInTheDocument();
});
