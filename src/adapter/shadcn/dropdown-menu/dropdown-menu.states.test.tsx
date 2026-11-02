import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { dropdownMenuSchema } from
  '../../../schema/dropdown-menu/dropdown-menu.schema.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnDropdownMenu } from './dropdown-menu.adapter.js';

it('preserves native link safety and explicit stay-open behavior', async () => {
  const user = userEvent.setup();
  const open = vi.fn();
  render(
    <ShadcnDropdownMenu
      label="Links" open onOpenChange={open} modal={false}
      items={[
        { type: 'link', key: 'guide', label: 'Guide', href: '#guide' },
        {
          type: 'link', key: 'stay', label: 'Stay', href: '#stay',
          closeOnSelect: false,
        },
        {
          type: 'link', key: 'external', label: 'External', href: 'https://reacd.dev',
          newWindow: true,
        },
        {
          type: 'link', key: 'blocked', label: 'Blocked', href: '#blocked',
          newWindow: true, disabled: true,
        },
      ]}
    />,
  );
  expect(screen.getByRole('menuitem', { name: 'External' }))
    .toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByRole('menuitem', { name: 'External' }))
    .toHaveAttribute('target', '_blank');
  const blocked = screen.getByRole('menuitem', { name: 'Blocked' });
  expect(blocked).not.toHaveAttribute('href');
  expect(blocked).not.toHaveAttribute('target');
  expect(blocked).not.toHaveAttribute('rel');
  await user.click(screen.getByRole('menuitem', { name: 'Stay' }));
  expect(open).not.toHaveBeenCalled();
  await user.click(screen.getByRole('menuitem', { name: 'Guide' }));
  expect(open).toHaveBeenCalledExactlyOnceWith(false);
});

it('maps choice closing policies and rejects invalid runtime callback results',
  async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    const checked = vi.fn(() => true);
    const radio = vi.fn(() => undefined);
    const properties = dropdownMenuSchema.parse({
      label: 'Choices', open: true, onOpenChange: open, modal: true,
      items: [
        {
          type: 'checkbox', key: 'pin', label: 'Pinned', checked: true,
          onCheckedChange: checked, closeOnSelect: true,
        },
        {
          type: 'radio', key: 'density', label: 'Density', value: 'normal',
          closeOnSelect: true, disabled: false, onValueChange: radio,
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'compact', label: 'Compact', disabled: false },
            { value: 'blocked', label: 'Unavailable density', disabled: true },
          ],
        },
        {
          type: 'radio', key: 'locked', label: 'Locked', value: 'one', disabled: true,
          onValueChange: radio, options: [{ value: 'one', label: 'Locked choice' }],
        },
        {
          type: 'action', key: 'invalid', label: 'Invalid result', intent: 'danger',
          onPress: () => 'invalid result', closeOnSelect: false,
        },
      ],
    });
    render(<ShadcnDropdownMenu {...properties} />);
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Pinned' }));
    expect(checked).toHaveBeenCalledExactlyOnceWith(false);
    expect(open).toHaveBeenCalledExactlyOnceWith(false);
    await user.click(screen.getByRole('menuitemradio', { name: 'Compact' }));
    expect(radio).toHaveBeenCalledExactlyOnceWith('compact');
    expect(open).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('menuitemradio', { name: 'Locked choice' }))
      .toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('menuitem', { name: 'Invalid result' }));
    expect(screen.getByRole('alert'))
      .toHaveTextContent('Menu callbacks must return a boolean or no value.');
    expect(open).toHaveBeenCalledTimes(2);
  });

it('suppresses controlled opening for disabled and inactive surfaces', async () => {
  const open = vi.fn();
  const view = render(
    <ShadcnDropdownMenu label="Unavailable" open onOpenChange={open} disabled
      items={[{ type: 'action', key: 'run', label: 'Run', onPress: vi.fn() }]} />,
  );
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  expect(screen.queryByRole('menu')).toBeNull();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnDropdownMenu label="Inactive" open onOpenChange={open} items={[]} />
    </PortalActiveContext>,
  );
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  expect(screen.getByRole('button', { name: 'Inactive' })).toBeDisabled();
  expect(open).not.toHaveBeenCalled();
});
