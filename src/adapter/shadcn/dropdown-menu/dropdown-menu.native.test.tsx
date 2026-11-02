import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnDropdownMenu } from './dropdown-menu.adapter.js';

it('delegates selection, veto and submenu focus to native menus', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  function Sample() {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(false);
    const [density, setDensity] = useState('normal');
    return (
      <ShadcnDropdownMenu
        label="Actions"
        open={open}
        onOpenChange={setOpen}
        items={[
          { type: 'label', key: 'label', label: 'Account' },
          { type: 'separator', key: 'separator' },
          { type: 'action', key: 'save', label: 'Save', onPress: action },
          { type: 'action', key: 'veto', label: 'Rejected', onPress: () => false },
          {
            type: 'checkbox',
            key: 'pin',
            label: 'Pinned',
            checked,
            onCheckedChange: setChecked,
          },
          {
            type: 'radio',
            key: 'density',
            label: 'Density',
            value: density,
            onValueChange: setDensity,
            options: [
              { value: 'normal', label: 'Normal' },
              { value: 'compact', label: 'Compact' },
            ],
          },
          {
            type: 'submenu',
            key: 'more',
            label: 'More',
            items: [{ type: 'action', key: 'child', label: 'Child', onPress: action }],
          },
        ]}
      />
    );
  }
  render(<Sample />);
  await user.click(screen.getByRole('button', { name: 'Actions' }));
  await screen.findByRole('menu', { name: 'Actions' });
  await user.click(screen.getByRole('menuitemcheckbox', { name: 'Pinned' }));
  expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await user.click(screen.getByRole('menuitemradio', { name: 'Compact' }));
  expect(screen.getByRole('menuitemradio', { name: 'Compact' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await user.click(screen.getByRole('menuitem', { name: 'Rejected' }));
  expect(screen.getByRole('alert')).toHaveTextContent('The menu change was rejected.');
  screen.getByRole('menuitem', { name: 'More' }).focus();
  await user.keyboard('{ArrowRight}');
  expect(await screen.findByRole('menuitem', { name: 'Child' })).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expect(screen.getByRole('menuitem', { name: 'More' })).toHaveFocus();
  await user.click(screen.getByRole('menuitem', { name: 'Save' }));
  expect(action).toHaveBeenCalledExactlyOnceWith();
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
});
