import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ContextMenu, ReacdProvider } from '../../../index.js';
import { Example } from '../../../../test-support/action-menu-example.js';

it('shows invalid runtime results and retains vetoed choice values', async () => {
  const user = userEvent.setup();
  const { menuPressSchema, menuBooleanChangeSchema, menuTextChangeSchema } =
    await import('../../../schema/action-menu/items.schema.js');
  const invalid = menuPressSchema.parse(() => 'invalid');
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Example
        items={[
          { type: 'action', key: 'invalid', label: 'Invalid action', onPress: invalid },
          {
            type: 'action',
            key: 'keep',
            label: 'Keep open',
            onPress: vi.fn(),
            closeOnSelect: false,
          },
          {
            type: 'checkbox',
            key: 'check',
            label: 'Blocked',
            checked: false,
            onCheckedChange: menuBooleanChangeSchema.parse(() => false),
          },
          {
            type: 'radio',
            key: 'radio',
            label: 'Mode',
            value: 'one',
            onValueChange: menuTextChangeSchema.parse(() => false),
            options: [
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' },
            ],
          },
          {
            type: 'link',
            key: 'plain',
            label: 'Plain link',
            href: '/',
            closeOnSelect: false,
          },
        ]}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button'));
  await user.click(await screen.findByRole('menuitem', { name: 'Invalid action' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Menu callbacks must return');
  await user.click(screen.getByRole('menuitem', { name: 'Keep open' }));
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('menuitemcheckbox', { name: 'Blocked' }));
  expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'false');
  await user.click(screen.getByRole('menuitemradio', { name: 'Two' }));
  expect(screen.getByRole('menuitemradio', { name: 'One' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(screen.getByRole('menuitem', { name: 'Plain link' })).not.toHaveAttribute(
    'target',
  );
});
it('uses default context content and removes disabled context keyboard access', () => {
  const { rerender } = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ContextMenu
        label="Context default"
        open={false}
        onOpenChange={vi.fn()}
        items={[]}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('group')).toHaveTextContent('Context default');
  expect(screen.getByRole('group')).toHaveAttribute('tabindex', '0');
  rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <ContextMenu
        label="Context default"
        disabled
        open={false}
        onOpenChange={vi.fn()}
        items={[]}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('group')).not.toHaveAttribute('tabindex');
});
it('closes choice menus only after accepted explicit close requests', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Example
        items={[
          {
            type: 'checkbox',
            key: 'check',
            label: 'Close choice',
            checked: false,
            onCheckedChange: vi.fn(),
            closeOnSelect: true,
          },
          {
            type: 'radio',
            key: 'mode',
            label: 'Mode',
            value: 'one',
            onValueChange: vi.fn(),
            closeOnSelect: true,
            options: [
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' },
            ],
          },
        ]}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button'));
  await user.click(await screen.findByRole('menuitemcheckbox'));
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  await user.click(screen.getByRole('button'));
  await user.click(await screen.findByRole('menuitemradio', { name: 'Two' }));
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
});
it('supports explicit context-menu keyboard gestures', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Example
        context
        items={[{ type: 'action', key: 'run', label: 'Run', onPress: vi.fn() }]}
      />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('group');
  trigger.focus();
  await user.keyboard('a{Shift>}{F10}{/Shift}');
  expect(await screen.findByRole('menu')).toBeVisible();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  trigger.focus();
  await user.keyboard('{ContextMenu}');
  expect(await screen.findByRole('menu')).toBeVisible();
});
it('places logical submenus using the application direction context', async () => {
  const user = userEvent.setup();
  const { App } = await import('../../../index.js');
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <App direction="rtl">
        <Example
          items={[
            {
              type: 'submenu',
              key: 'sub',
              label: 'More',
              items: [{ type: 'action', key: 'run', label: 'Run', onPress: vi.fn() }],
            },
          ]}
        />
      </App>
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button'));
  await user.click(await screen.findByRole('menuitem', { name: 'More' }));
  const menu = await screen.findByRole('menu', { name: 'More' });
  expect(menu.closest('[dir]')).toHaveAttribute('dir', 'rtl');
});
