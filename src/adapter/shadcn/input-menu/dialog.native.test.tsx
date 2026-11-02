import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnModal } from '../modal/modal.adapter.js';
import { ShadcnInputMenu } from './input-menu.adapter.js';

it('dismisses the native suggestion popup before its parent dialog', async () => {
  const parentChange = vi.fn();
  const valueChange = vi.fn();
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <ShadcnModal
        title="Choose destination"
        description="Project destination"
        triggerLabel="Open destination dialog"
        open={open}
        onOpenChange={(next) => {
          parentChange(next);
          setOpen(next);
        }}
      >
        <ShadcnInputMenu
          label="Destination"
          value=""
          items={[{ value: 'a', label: 'Alpha' }]}
          onValueChange={valueChange}
        />
      </ShadcnModal>
    );
  }
  render(<Example />);
  const opener = screen.getByRole('button', { name: 'Open destination dialog' });
  await userEvent.click(opener);
  parentChange.mockClear();
  const input = screen.getByRole('combobox', { name: 'Destination' });
  await userEvent.click(input);
  expect(await screen.findByRole('listbox')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  expect(screen.getByRole('dialog', { name: 'Choose destination' })).toBeVisible();
  expect(parentChange).not.toHaveBeenCalled();
  expect(valueChange).not.toHaveBeenCalled();
  expect(input).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(parentChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(opener).toHaveFocus();
});
