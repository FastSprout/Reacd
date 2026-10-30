import { chooseOption } from '../../test-support/select-choice.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SidebarExample } from './sidebar.js';
import { installLayout, resizeContainers } from '../../test-support/layout-observer.js';

const INTERACTION_TIMEOUT_MS = 20_000;
let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

it(
  'runs Sidebar retained state and logical placement controls',
  async () => {
    const user = userEvent.setup();
    const view = render(
      <ReacdProvider>
        <SidebarExample />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('switch', { name: 'Sidebar RTL' }));
    await user.click(screen.getByRole('switch', { name: 'Sidebar RTL' }));
    await user.click(screen.getByRole('switch', { name: 'Sidebar end side' }));
    await user.click(screen.getByRole('switch', { name: 'Sidebar end side' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Sidebar workspace query' }), {
      target: { value: 'Changed query' },
    });
    await user.click(screen.getByRole('button', { name: 'Inspect workspace' }));
    expect(screen.getByText('Workspace inspected.')).toBeVisible();
    resizeContainers(320);
    await user.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(
      screen.getByRole('textbox', { name: 'Sidebar workspace query' }),
    ).toHaveValue('Changed query');
    await user.keyboard('{Escape}');
    view.unmount();
  },
  INTERACTION_TIMEOUT_MS,
);

it(
  'runs each supported Sidebar appearance',
  async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <SidebarExample />
      </ReacdProvider>,
    );
    for (const variant of ['floating', 'inset', 'sidebar']) {
      await chooseOption(user, 'Sidebar appearance', variant);
      expect(screen.getByRole('complementary')).toHaveAttribute(
        'data-variant',
        variant,
      );
    }
  },
  INTERACTION_TIMEOUT_MS,
);

it(
  'runs each supported Sidebar collapse policy',
  async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <SidebarExample />
      </ReacdProvider>,
    );
    for (const policy of ['icon', 'none', 'offcanvas']) {
      await chooseOption(user, 'Sidebar collapse policy', policy);
    }
    expect(screen.getByRole('button', { name: 'Toggle navigation' })).toBeVisible();
  },
  INTERACTION_TIMEOUT_MS,
);
