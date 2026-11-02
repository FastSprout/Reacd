import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnModal } from '../modal/modal.adapter.js';
import { ShadcnSelectMenu } from './select-menu.adapter.js';

it('scopes native popup Escape and dismissal veto inside its dialog', async () => {
  const parentChange = vi.fn();
  const popupChange = vi.fn();
  const valueChange = vi.fn();
  let veto = true;
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <ShadcnModal
        title="Choose owner"
        description="Project ownership"
        triggerLabel="Open owner dialog"
        open={open}
        onOpenChange={(next) => {
          parentChange(next);
          setOpen(next);
        }}
      >
        <ShadcnSelectMenu
          label="Owner"
          items={[{ value: 'a', label: 'Alpha' }]}
          value="a"
          onValueChange={valueChange}
          onOpenChange={(next) => {
            popupChange(next);
            return next || !veto;
          }}
        />
      </ShadcnModal>
    );
  }
  render(<Example />);
  const opener = screen.getByRole('button', { name: 'Open owner dialog' });
  await userEvent.click(opener);
  parentChange.mockClear();
  const trigger = screen.getByRole('combobox', { name: 'Owner' });
  await userEvent.click(trigger);
  const search = await screen.findByRole('combobox', { name: 'Search Owner' });
  await waitFor(() => expect(search).toHaveFocus());
  await userEvent.keyboard('{Escape}');
  expect(popupChange).toHaveBeenLastCalledWith(false);
  expect(search).toBeVisible();
  expect(parentChange).not.toHaveBeenCalled();
  veto = false;
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  expect(screen.getByRole('dialog', { name: 'Choose owner' })).toBeVisible();
  expect(parentChange).not.toHaveBeenCalled();
  expect(valueChange).not.toHaveBeenCalled();
  expect(trigger).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(parentChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(opener).toHaveFocus();
});
