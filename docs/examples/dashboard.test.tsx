import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DashboardExample } from './dashboard.js';
import { installLayout } from '../../test-support/layout-observer.js';

const INTERACTION_TIMEOUT_MS = 20_000;
let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

it(
  'runs retained drafts, structural controls and multiple content panels',
  async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <DashboardExample />
      </ReacdProvider>,
    );
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Dashboard navigation draft' }),
      { target: { value: 'Updated draft' } },
    );
    await user.click(screen.getByRole('button', { name: 'Inspect dashboard inbox' }));
    expect(screen.getByText('Inbox inspected.')).toBeVisible();
    await user.click(
      screen.getByRole('switch', { name: 'Additional dashboard panel' }),
    );
    await user.click(screen.getByRole('button', { name: 'Inspect dashboard notes' }));
    expect(screen.getByText('Notes inspected.')).toBeVisible();
    expect(screen.getByText('notes expanded share: 25')).toBeVisible();
    await user.click(
      screen.getByRole('switch', { name: 'Additional dashboard panel' }),
    );
    await user.click(screen.getByRole('switch', { name: 'Dashboard RTL' }));
    await user.click(screen.getByRole('switch', { name: 'Dashboard RTL' }));
    await user.click(screen.getByRole('switch', { name: 'Dashboard icon collapse' }));
    await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
    await user.click(screen.getByRole('button', { name: 'Expand workspace' }));
    expect(
      screen.getByRole('textbox', { name: 'Dashboard navigation draft' }),
    ).toHaveValue('Updated draft');
    await user.click(screen.getByRole('switch', { name: 'Dashboard icon collapse' }));
    await user.click(
      screen.getByRole('switch', { name: 'Disable dashboard resizing' }),
    );
    await user.click(
      screen.getByRole('switch', { name: 'Disable dashboard resizing' }),
    );
    await user.click(screen.getByRole('button', { name: 'Clear dashboard draft' }));
    expect(
      screen.getByRole('textbox', { name: 'Dashboard navigation draft' }),
    ).toHaveValue('');
  },
  INTERACTION_TIMEOUT_MS,
);

it(
  'runs visible search states, selection veto and accepted command callbacks',
  async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <DashboardExample />
      </ReacdProvider>,
    );
    for (const status of ['loading', 'error', 'ready']) {
      await chooseOption(user, 'Dashboard command status', status);
    }
    await user.click(
      screen.getByRole('switch', { name: 'Reject dashboard selection' }),
    );
    await user.click(screen.getByRole('button', { name: 'Find workspace command' }));
    await user.type(
      screen.getByRole('combobox', { name: 'Find dashboard commands' }),
      'memo',
    );
    await user.click(screen.getByRole('option', { name: 'Inspect notes' }));
    expect(screen.getByRole('dialog', { name: 'Workspace commands' })).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(
      screen.getByRole('switch', { name: 'Reject dashboard selection' }),
    );
    await user.click(screen.getByRole('button', { name: 'Search dashboard' }));
    await user.click(screen.getByRole('option', { name: 'Inspect notes' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByText('inspect-notes')).toBeVisible();
    expect(screen.getByText('Notes inspected.')).toBeVisible();
  },
  INTERACTION_TIMEOUT_MS,
);
