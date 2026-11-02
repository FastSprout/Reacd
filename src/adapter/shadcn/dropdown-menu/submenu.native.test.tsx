import { DirectionProvider } from '@radix-ui/react-direction';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnDropdownMenu } from './dropdown-menu.adapter.js';
import { ShadcnModal } from '../modal/modal.adapter.js';

it.each(['pointer', 'keyboard'] as const)(
  'selects a native submenu radio item through %s activation',
  async (activation) => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ShadcnDropdownMenu
        label="Settings"
        open
        onOpenChange={vi.fn()}
        modal={false}
        items={[
          {
            type: 'submenu',
            key: 'color',
            label: 'Primary color',
            items: [
              {
                type: 'radio',
                key: 'colors',
                label: 'Color',
                value: 'green',
                onValueChange: change,
                closeOnSelect: false,
                options: [
                  { value: 'green', label: 'Green' },
                  { value: 'blue', label: 'Blue' },
                ],
              },
            ],
          },
        ]}
      />,
    );
    const trigger = screen.getByRole('menuitem', { name: 'Primary color' });
    expect(screen.getByRole('menu', { name: 'Settings' })).toHaveAttribute(
      'data-open',
      '',
    );
    trigger.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('menuitemradio', { name: 'Green' })).toHaveFocus();
    if (activation === 'pointer') {
      await user.click(screen.getByRole('menuitemradio', { name: 'Blue' }));
    } else {
      await user.keyboard('{ArrowDown}{Enter}');
    }
    expect(change).toHaveBeenCalledExactlyOnceWith('blue');
    expect(screen.getByRole('menu', { name: 'Settings' })).toBeVisible();
  },
);
it('keeps submenus in their Dialog outside the root menu box', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <ShadcnModal
        title="Appearance"
        description="Project colors"
        open
        onOpenChange={vi.fn()}
      >
        <ShadcnDropdownMenu
          label="Settings"
          open={open}
          onOpenChange={setOpen}
          modal={false}
          items={[
            {
              type: 'submenu',
              key: 'colors',
              label: 'Colors',
              items: [
                {
                  type: 'radio',
                  key: 'primary',
                  label: 'Primary',
                  value: 'green',
                  onValueChange: change,
                  closeOnSelect: false,
                  options: [
                    { value: 'green', label: 'Green' },
                    { value: 'blue', label: 'Blue' },
                  ],
                },
              ],
            },
          ]}
        />
      </ShadcnModal>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Settings' }));
  const root = await screen.findByRole('menu', { name: 'Settings' });
  screen.getByRole('menuitem', { name: 'Colors' }).focus();
  await user.keyboard('{ArrowRight}');
  const blue = screen.getByRole('menuitemradio', { name: 'Blue' });
  expect(screen.getByRole('dialog', { name: 'Appearance' }).contains(blue)).toBe(true);
  expect(root.contains(blue)).toBe(false);
  await user.keyboard('{ArrowDown}{Enter}');
  expect(change).toHaveBeenCalledExactlyOnceWith('blue');
  expect(root).toBeVisible();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(root).not.toBeInTheDocument());
  expect(screen.getByRole('dialog', { name: 'Appearance' })).toBeVisible();
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveFocus(),
  );
});

it('preserves native RTL popup direction and submenu keyboard navigation', async () => {
  const user = userEvent.setup();
  render(
    <DirectionProvider dir="rtl">
      <ShadcnDropdownMenu
        label="RTL settings"
        open
        modal={false}
        onOpenChange={vi.fn()}
        items={[
          {
            type: 'submenu',
            key: 'share',
            label: 'Share',
            items: [
              {
                type: 'action',
                key: 'copy',
                label: 'Copy reference',
                onPress: vi.fn(),
              },
            ],
          },
        ]}
      />
    </DirectionProvider>,
  );
  const root = screen.getByRole('menu', { name: 'RTL settings' });
  expect(root).toHaveAttribute('dir', 'rtl');
  const trigger = screen.getByRole('menuitem', { name: 'Share' });
  trigger.focus();
  await user.keyboard('{ArrowLeft}');
  const submenu = screen.getByRole('menu', { name: 'Share' });
  expect(submenu).toHaveAttribute('dir', 'rtl');
  expect(screen.getByRole('menuitem', { name: 'Copy reference' })).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  await waitFor(() => expect(submenu).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});
