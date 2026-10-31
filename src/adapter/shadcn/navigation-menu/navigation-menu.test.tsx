import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { App, Modal, NavigationMenu, ReacdProvider } from '../../../index.js';

function NestedMenu() {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      title="Resource dialog"
      description="Choose a resource."
      open={open}
      onOpenChange={setOpen}
    >
      <NavigationMenu
        label="Dialog resources"
        items={[
          {
            key: 'group',
            label: 'Dialog group',
            children: [{ key: 'child', label: 'Dialog child', href: '/' }],
          },
        ]}
      />
    </Modal>
  );
}

describe('shadcn NavigationMenu', () => {
  it('dismisses the submenu before an enclosing modal', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <NestedMenu />
      </ReacdProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Dialog group' });
    await user.click(trigger);
    await screen.findByRole('link', { name: 'Dialog child' });
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Resource dialog' })).toBeVisible();
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Dialog child' })).toBeNull();
    });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('opens groups, runs child actions and returns focus after Escape', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <NavigationMenu
          label="Main resources"
          items={[
            {
              key: 'docs',
              label: 'Documentation',
              description: 'Read the guides.',
              children: [
                { key: 'guide', label: 'Guide', href: '/guide', active: true },
                { key: 'task', label: 'Run child action', onPress: action },
                {
                  key: 'disabled',
                  label: 'Disabled child',
                  href: '/disabled',
                  disabled: true,
                },
              ],
            },
            { key: 'action', label: 'Run top action', onPress: action },
            {
              key: 'blocked',
              label: 'Blocked action',
              onPress: action,
              disabled: true,
            },
            { key: 'info', label: 'Information' },
            {
              key: 'site',
              label: 'External site',
              href: 'https://reacd.dev/',
              newWindow: true,
            },
            {
              key: 'closed',
              label: 'Blocked group',
              disabled: true,
              children: [{ key: 'hidden', label: 'Hidden link', href: '/hidden' }],
            },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Run top action' }));
    expect(action.mock.calls).toEqual([[]]);
    await user.click(screen.getByRole('button', { name: 'Blocked action' }));
    const trigger = screen.getByRole('button', { name: 'Documentation' });
    await user.click(trigger);
    expect(await screen.findByRole('link', { name: 'Guide' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('Read the guides.')).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Disabled child' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Run child action' }));
    expect(action.mock.calls).toEqual([[], []]);
    await user.click(trigger);
    await screen.findByRole('link', { name: 'Guide' });
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('link', { name: 'External site' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });
  it.each(['ltr', 'rtl'] as const)(
    'supports vertical groups in scoped %s',
    async (direction) => {
      const user = userEvent.setup();
      render(
        <ReacdProvider adapter={shadcnAdapter}>
          <App direction={direction}>
            <NavigationMenu
              label="Vertical resources"
              orientation="vertical"
              items={[
                {
                  key: 'group',
                  label: 'More resources',
                  children: [{ key: 'guide', label: 'Vertical guide', href: '/guide' }],
                },
              ]}
            />
          </App>
        </ReacdProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'More resources' }));
      expect(await screen.findByRole('link', { name: 'Vertical guide' })).toBeVisible();
    },
  );
});
