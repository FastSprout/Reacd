import { useState } from 'react';
import type { FormEvent } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnListbox } from './listbox.adapter.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Charlie' },
] as const;

it('navigates without selection and preserves parent Escape ownership', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const escaped = vi.fn();
  render(
    <div
      onKeyDown={(event) => {
        if (event.key === 'Escape') escaped();
      }}
    >
      <ShadcnListbox label="Choose" items={items} value="a" onValueChange={change} />
    </div>,
  );
  await user.tab();
  expect(screen.getByRole('option', { name: 'Alpha' })).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('option', { name: 'Beta' })).toHaveFocus();
  await user.keyboard('{End}');
  expect(screen.getByRole('option', { name: 'Charlie' })).toHaveFocus();
  await user.keyboard('{Home}b');
  expect(screen.getByRole('option', { name: 'Beta' })).toHaveFocus();
  expect(change).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(escaped).toHaveBeenCalledOnce();
  expect(change).not.toHaveBeenCalled();
});

it('does not select or submit an IME Enter carrying keyCode13', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const submit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <ShadcnListbox label="Choose" items={items} value="a" onValueChange={change} />
      <button type="submit">Save</button>
    </form>,
  );
  await user.tab();
  await user.keyboard('{ArrowDown}');
  fireEvent.keyDown(screen.getByRole('option', { name: 'Beta' }), {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    isComposing: true,
  });
  expect(change).not.toHaveBeenCalled();
  expect(submit).not.toHaveBeenCalled();
});

it('keeps meaningful list focus after an accepted Clear request', async () => {
  const user = userEvent.setup();
  function Example() {
    const [value, setValue] = useState('a');
    return (
      <ShadcnListbox
        label="Choose"
        items={items}
        value={value}
        onValueChange={setValue}
      />
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(screen.getByRole('button', { name: 'Clear selection' })).toBeDisabled();
  expect(screen.getByRole('listbox').contains(document.activeElement)).toBe(true);
});
