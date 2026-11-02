import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { ContextMenuProps } from
  '../../../components/context-menu/context-menu.props.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnContextMenu } from './context-menu.adapter.js';

function Example() {
  const [open, change] = useState(false);
  const [checked, check] = useState(false);
  const [value, select] = useState('one');
  const items: ContextMenuProps['items'] = [
    { type: 'label', key: 'label', label: 'Record actions' },
    { type: 'checkbox', key: 'check', label: 'Pin', checked, onCheckedChange: check },
    {
      type: 'radio',
      key: 'mode',
      label: 'Mode',
      value,
      onValueChange: select,
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
      ],
    },
    { type: 'separator', key: 'separator' },
    {
      type: 'submenu',
      key: 'more',
      label: 'More',
      items: [
        {
          type: 'action',
          key: 'run',
          label: 'Run',
          intent: 'danger',
          onPress: () => undefined,
        },
      ],
    },
    {
      type: 'action',
      key: 'keep',
      label: 'Keep open',
      closeOnSelect: false,
      onPress: () => undefined,
    },
  ];
  return (
    <ShadcnContextMenu label="Record" open={open} onOpenChange={change} items={items}>
      Record content
    </ShadcnContextMenu>
  );
}
it('uses native context trigger, controlled choices and close policy', async () => {
  render(<Example />);
  const trigger = screen.getByRole('group', { name: 'Record' });
  expect(trigger).toHaveAttribute('data-slot', 'context-menu-trigger');
  fireEvent.contextMenu(trigger, { clientX: 80, clientY: 100 });
  const menu = await screen.findByRole('menu', { name: 'Record' });
  expect(menu).toHaveAttribute('data-slot', 'context-menu-content');
  await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Pin' }));
  expect(screen.getByRole('menuitemcheckbox', { name: 'Pin' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await userEvent.click(screen.getByRole('menuitemradio', { name: 'Two' }));
  expect(screen.getByRole('menuitemradio', { name: 'Two' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await userEvent.click(screen.getByRole('menuitem', { name: 'Keep open' }));
  expect(menu).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
});

it('vetoes rejected actions and clears accepted-selection diagnostics', async () => {
  const view = render(
    <ShadcnContextMenu
      label="Record"
      open
      onOpenChange={() => undefined}
      items={[
        { type: 'action', key: 'veto', label: 'Rejected', onPress: () => false },
        { type: 'action', key: 'ok', label: 'Accepted', onPress: () => true },
      ]}
    >
      Record
    </ShadcnContextMenu>,
  );
  await userEvent.click(await screen.findByRole('menuitem', { name: 'Rejected' }));
  expect(screen.getByRole('alert')).toHaveTextContent('The menu change was rejected.');
  await userEvent.click(screen.getByRole('menuitem', { name: 'Accepted' }));
  expect(screen.queryByRole('alert')).toBeNull();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnContextMenu
        label="Record"
        open
        onOpenChange={() => undefined}
        disabled
        items={[]}
      >
        Record
      </ShadcnContextMenu>
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('menu')).toBeNull();
  expect(screen.getByRole('group', { name: 'Record' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
});

it('keeps declared URL and disabled link semantics in native items', async () => {
  render(
    <ShadcnContextMenu
      label="Record"
      open
      onOpenChange={() => undefined}
      items={[
        {
          type: 'link',
          key: 'docs',
          label: 'Documentation',
          href: '/docs',
          newWindow: true,
          closeOnSelect: false,
        },
        {
          type: 'link',
          key: 'disabled',
          label: 'Unavailable',
          href: '/private',
          disabled: true,
        },
      ]}
    >
      Record
    </ShadcnContextMenu>,
  );
  const link = await screen.findByRole('menuitem', { name: 'Documentation' });
  expect(link).toHaveAttribute('href', '/docs');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  const disabled = screen.getByRole('menuitem', { name: 'Unavailable' });
  expect(disabled).toHaveAttribute('aria-disabled', 'true');
  expect(disabled).not.toHaveAttribute('href');
});

it('dismisses only the native submenu before its parent', async () => {
  render(<Example />);
  fireEvent.contextMenu(screen.getByRole('group', { name: 'Record' }));
  await userEvent.click(await screen.findByRole('menuitem', { name: 'More' }));
  expect(await screen.findByRole('menuitem', { name: 'Run' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await waitFor(() =>
    expect(screen.queryByRole('menuitem', { name: 'Run' })).toBeNull(),
  );
  expect(screen.getByRole('menu', { name: 'Record' })).toBeVisible();
});

it('delegates keyboard menu traversal and Tab exit to the native SDK', async () => {
  const change = vi.fn();
  render(
    <ShadcnContextMenu
      label="Keyboard menu"
      open
      onOpenChange={change}
      items={[
        { type: 'action', key: 'one', label: 'One', onPress: () => undefined },
        { type: 'action', key: 'two', label: 'Two', onPress: () => undefined },
      ]}
    >
      Record
    </ShadcnContextMenu>,
  );
  const one = await screen.findByRole('menuitem', { name: 'One' });
  one.focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveFocus();
  await userEvent.tab();
  expect(change).toHaveBeenCalledWith(false);
});

it('retains a menu after the native extended long press is released', async () => {
  vi.useFakeTimers();
  try {
    render(<Example />);
    const trigger = screen.getByRole('group', { name: 'Record' });
    fireEvent.touchStart(trigger, { touches: [{ clientX: 80, clientY: 120 }] });
    await act(() => vi.advanceTimersByTimeAsync(1500));
    expect(screen.getByRole('menu', { name: 'Record' })).toBeVisible();
    fireEvent.touchEnd(trigger, { changedTouches: [{ clientX: 80, clientY: 120 }] });
    expect(screen.getByRole('menu', { name: 'Record' })).toBeVisible();
  } finally {
    vi.useRealTimers();
  }
});
