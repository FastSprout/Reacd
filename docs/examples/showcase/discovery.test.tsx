import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PeopleCard } from './people.js';
import { CommandsCard } from './commands.js';
import { ShortcutsCard } from './shortcuts.js';
import { WorkspaceCard } from './workspace.js';

it('opens local people and filters then selects workspace commands', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PeopleCard />
      <CommandsCard />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Avery Morgan' }));
  expect(screen.getByText('Selected profile: Avery Morgan.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Sam Rivera' }));
  expect(screen.getByText('Selected profile: Sam Rivera.')).toBeVisible();
  const search = screen.getByRole('combobox', { name: 'Find a workspace action' });
  await user.type(search, 'folder');
  expect(screen.queryByRole('option', { name: 'Add new file' })).toBeNull();
  await user.click(screen.getByRole('option', { name: 'Add new folder' }));
  expect(screen.getByText('Selected action: add-folder.')).toBeVisible();
  await user.clear(search);
  await user.click(screen.getByRole('option', { name: 'Add new file' }));
  expect(screen.getByText('Selected action: add-file.')).toBeVisible();
  await user.click(screen.getByRole('option', { name: 'Add a label' }));
  expect(screen.getByText('Selected action: add-label.')).toBeVisible();
});

it('keeps workspace navigation and native keyboard actions independent', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <WorkspaceCard />
      <ShortcutsCard />
    </ReacdProvider>,
  );
  for (const name of ['Inbox', 'Projects', 'Calendar', 'Settings', 'Dashboard']) {
    await user.click(screen.getByRole('button', { name }));
    expect(screen.getByText(`Workspace view: ${name}.`)).toBeVisible();
  }
  expect(screen.getByRole('img', { name: 'Move between actions' })).toBeVisible();
  screen.getByRole('button', { name: 'Save draft' }).focus();
  await user.keyboard('{Enter}');
  expect(screen.getByText('Draft saved locally.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Reset draft' }));
  expect(screen.getByText('Draft reset.')).toBeVisible();
});
