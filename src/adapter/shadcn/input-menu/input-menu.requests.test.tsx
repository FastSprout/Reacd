import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { inputMenuSchema } from '../../../schema/input-menu/index.js';
import { ShadcnInputMenu } from './input-menu.adapter.js';

const items = [{ value: 'paris', label: 'Paris' }];

it('keeps canonical text and popup on rejected text requests', async () => {
  const write = vi.fn(() => false);
  render(<ShadcnInputMenu label="City" value="" items={items} onValueChange={write} />);
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.click(input);
  await userEvent.click(await screen.findByRole('option', { name: 'Paris' }));
  expect(write).toHaveBeenCalledExactlyOnceWith('Paris');
  expect(input).toHaveValue('');
  expect(screen.getByRole('listbox')).toBeVisible();
});

it('rejects asynchronous preflight and thrown text callbacks', async () => {
  const write = vi.fn();
  const invalid = inputMenuSchema.parse({
    label: 'City',
    value: '',
    items,
    onValueChange: write,
    onSuggestionSelect: () => Promise.resolve(true),
  });
  const view = render(<ShadcnInputMenu {...invalid} />);
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.click(input);
  await userEvent.click(await screen.findByRole('option', { name: 'Paris' }));
  expect(write).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('boolean or no value');
  expect(input).toHaveAccessibleDescription(
    'Change callbacks must return a boolean or no value.',
  );
  view.rerender(
    <ShadcnInputMenu
      label="City"
      value=""
      items={items}
      onValueChange={() => {
        throw new Error('Rejected');
      }}
    />,
  );
  await userEvent.click(screen.getByRole('option', { name: 'Paris' }));
  expect(screen.getByRole('alert')).toHaveTextContent('could not be completed');
  expect(input).toHaveValue('');
});

it('keeps host-rejected typing out of native form entries', async () => {
  const view = render(
    <form>
      <ShadcnInputMenu
        label="City"
        value="Paris"
        name="city"
        items={items}
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.type(input, 'x');
  expect(input).toHaveValue('Paris');
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(Array.from(new FormData(form))).toEqual([['city', 'Paris']]);
});

it('keeps the SDK clear keyboard-reachable after popup dismissal', async () => {
  const write = vi.fn();
  function Example() {
    const [value, change] = useState('Paris');
    return (
      <ShadcnInputMenu
        label="City"
        value={value}
        items={items}
        onValueChange={(next) => {
          write(next);
          change(next);
        }}
      />
    );
  }
  render(<Example />);
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.click(input);
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  const clear = screen.getByRole('button', { name: 'Clear text: City' });
  expect(clear).toHaveAttribute('tabindex', '0');
  clear.focus();
  await userEvent.keyboard('{Enter}');
  expect(write).toHaveBeenCalledExactlyOnceWith('');
  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('button', { name: 'Clear text: City' })).toBeNull();
});

it('vetoes clear before native focus and disclosure changes', async () => {
  render(
    <ShadcnInputMenu
      label="City"
      value="Paris"
      items={items}
      onValueChange={() => false}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'City' }));
  const clear = screen.getByRole('button', { name: 'Clear text: City' });
  clear.focus();
  await userEvent.keyboard('{Enter}');
  expect(clear).toHaveFocus();
  expect(screen.getByRole('combobox', { name: 'City' })).toHaveValue('Paris');
  expect(screen.getByRole('listbox')).toBeVisible();
});

it('vetoes controlled disclosure without a text request', async () => {
  const open = vi.fn(() => false);
  const write = vi.fn();
  render(
    <ShadcnInputMenu
      label="City"
      value=""
      items={items}
      open={false}
      onOpenChange={open}
      onValueChange={write}
    />,
  );
  screen.getByRole('combobox', { name: 'City' }).focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(open).toHaveBeenCalledWith(true);
  expect(screen.queryByRole('listbox')).toBeNull();
  expect(write).not.toHaveBeenCalled();
});
