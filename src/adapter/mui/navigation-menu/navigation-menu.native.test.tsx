import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { MuiNavigationMenu } from './navigation-menu.adapter.js';

it('uses native MUI actions and links without leaking events', async () => {
  const press = vi.fn();
  render(
    <MuiNavigationMenu
      label="Workspace"
      orientation="vertical"
      items={[
        { key: 'home', label: 'Home', href: '/home/', active: true },
        { key: 'new', label: 'New project', active: true, onPress: press },
        { key: 'docs', label: 'Docs', href: '/docs/', newWindow: true },
        { key: 'label', label: 'Workspace tools' },
      ]}
    />,
  );
  expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
    'target',
    '_blank',
  );
  await userEvent.click(screen.getByRole('button', { name: 'New project' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(screen.getByText('Workspace tools')).toBeVisible();
});

it(
  'delegates disclosure keyboard, focus return and actions to Menu/MenuItem',
  async () => {
    const press = vi.fn();
    render(
      <MuiNavigationMenu
        label="Resources"
        items={[
          {
            key: 'tools',
            label: 'Tools',
            description: 'Workspace actions',
            children: [
              { key: 'new', label: 'New file', onPress: press },
              { key: 'docs', label: 'Read docs', href: '/docs/' },
              { key: 'locked', label: 'Unavailable', disabled: true, onPress: press },
            ],
          },
        ]}
      />,
    );
    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: 'Tools' });
    await user.click(trigger);
    const menu = await screen.findByRole('group', { name: 'Tools' });
    expect(menu.closest('.MuiMenu-paper')).not.toBeNull();
    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByRole('button', { name: 'New file' })).toHaveFocus();
    const locked = screen.getByRole('button', { name: 'Unavailable' });
    expect(locked).toBeDisabled();
    fireEvent.click(locked);
    expect(press).not.toHaveBeenCalled();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: 'Read docs' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'New file' }));
    expect(press).toHaveBeenCalledExactlyOnceWith();
  },
);

it('keeps inherited pending actions and links protected', async () => {
  const press = vi.fn();
  render(
    <FormPendingContext value={true}>
      <MuiNavigationMenu
        label="Workspace"
        items={[
          { key: 'action', label: 'Open', onPress: press },
          { key: 'link', label: 'Docs', href: '/docs/', newWindow: true },
        ]}
      />
    </FormPendingContext>,
  );
  expect(screen.getByRole('button', { name: 'Open' })).toBeDisabled();
  expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('href');
  fireEvent.click(screen.getByRole('button', { name: 'Open' }));
  expect(press).not.toHaveBeenCalled();
});

it(
  'keeps grouped native links, descriptions and labels and drops stale open state',
  async () => {
    const content = (pending: boolean) => (
      <FormPendingContext value={pending}>
        <MuiNavigationMenu
          label="Tools"
          items={[
            {
              key: 'group',
              label: 'Workspace',
              active: true,
              children: [
                {
                  key: 'active',
                  label: 'Current guide',
                  href: '/guide/',
                  active: true,
                  newWindow: true,
                },
                { key: 'other', label: 'Other guide', href: '/other/' },
                { key: 'label', label: 'More resources' },
                { key: 'action', label: 'Action', onPress: vi.fn() },
              ],
            },
          ]}
        />
      </FormPendingContext>
    );
    const view = render(content(false));
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Workspace' }));
    const link = await screen.findByRole('link', { name: 'Current guide' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'Other guide' })).not.toHaveAttribute(
      'target',
    );
    expect(screen.getByText('More resources')).toBeVisible();
    view.rerender(content(true));
    await waitFor(() =>
      expect(screen.queryByRole('group', { name: 'Workspace' })).toBeNull(),
    );
    expect(screen.getByRole('button', { name: 'Workspace' })).toBeDisabled();
    view.rerender(content(false));
    expect(screen.queryByRole('group', { name: 'Workspace' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Workspace' }));
    expect(await screen.findByRole('link', { name: 'Current guide' })).toBeVisible();
  },
);
