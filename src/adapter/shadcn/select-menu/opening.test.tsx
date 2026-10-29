import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';

it('requests one logical open and exposes the searchable popup', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <ReacdProvider>
        <SelectMenu
          label="Opening"
          value=""
          items={[]}
          onValueChange={() => undefined}
          open={open}
          onOpenChange={(next) => {
            change(next);
            setOpen(next);
          }}
        />
      </ReacdProvider>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('combobox', { name: 'Opening' }));
  expect(await screen.findByRole('combobox', { name: 'Search Opening' })).toBeVisible();
  expect(change.mock.calls).toEqual([[true]]);
});

it('opens with Space and commits only after keyboard activation', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ReacdProvider>
      <SelectMenu
        label="Keyboard records"
        value=""
        items={[{ value: '42', label: 'Answer' }]}
        onValueChange={change}
      />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Keyboard records' });
  trigger.focus();
  await user.keyboard(' ');
  const query = await screen.findByRole('combobox', {
    name: 'Search Keyboard records',
  });
  expect(query).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(change).not.toHaveBeenCalled();
  await user.keyboard('{Enter}');
  expect(change).toHaveBeenCalledExactlyOnceWith('42');
});
