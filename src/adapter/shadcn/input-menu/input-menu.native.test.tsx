import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputMenu } from './input-menu.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

const items = [
  { value: 'a', label: 'Same' },
  { value: 'b', label: 'Same' },
];

it('preserves duplicate-label pointer identity and preflight order', async () => {
  const calls: string[] = [];
  const preflight = vi.fn(
    (value: { readonly value: string; readonly text: string }) => {
      calls.push(value.value);
    },
  );
  const write = vi.fn();
  function Example() {
    const [value, setValue] = useState('');
    return (
      <ShadcnInputMenu
        label="Destination"
        value={value}
        items={items}
        onSuggestionSelect={preflight}
        onValueChange={(next) => {
          calls.push(next);
          write(next);
          setValue(next);
        }}
      />
    );
  }
  render(<Example />);
  const input = screen.getByRole('combobox', { name: 'Destination' });
  await userEvent.click(input);
  const [, second] = await screen.findAllByRole('option', { name: 'Same' });
  if (!second) throw new Error('Missing second SDK option.');
  await userEvent.click(second);
  expect(calls).toEqual(['b', 'Same']);
  expect(preflight).toHaveBeenCalledExactlyOnceWith({ value: 'b', text: 'Same' });
  expect(write).toHaveBeenCalledExactlyOnceWith('Same');
  expect(input).toHaveValue('Same');
});

it('preserves keyboard identity without duplicate unchanged text writes', async () => {
  const preflight = vi.fn();
  const write = vi.fn();
  render(
    <ShadcnInputMenu
      label="Destination"
      value="Same"
      items={items}
      onSuggestionSelect={preflight}
      onValueChange={write}
    />,
  );
  const input = screen.getByRole('combobox', { name: 'Destination' });
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
  expect(preflight).toHaveBeenCalledExactlyOnceWith({ value: 'b', text: 'Same' });
  expect(write).not.toHaveBeenCalled();
  expect(input).toHaveValue('Same');
});

it('uses the actual SDK drag-release activation key', async () => {
  const preflight = vi.fn();
  const write = vi.fn();
  render(
    <ShadcnInputMenu
      label="Destination"
      value=""
      items={items}
      onSuggestionSelect={preflight}
      onValueChange={write}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Destination' }));
  await userEvent.keyboard('{ArrowDown}{ArrowDown}');
  const [, second] = await screen.findAllByRole('option', { name: 'Same' });
  if (!second) throw new Error('Missing second SDK option.');
  fireEvent.mouseUp(second, { button: 0 });
  expect(preflight).toHaveBeenCalledExactlyOnceWith({ value: 'b', text: 'Same' });
  expect(write).toHaveBeenCalledExactlyOnceWith('Same');
});

it('vetoes preflight before text and native popup closing', async () => {
  const write = vi.fn();
  render(
    <ShadcnInputMenu
      label="Destination"
      value=""
      items={items}
      onSuggestionSelect={() => false}
      onValueChange={write}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Destination' }));
  const [first] = await screen.findAllByRole('option', { name: 'Same' });
  if (!first) throw new Error('Missing first SDK option.');
  await userEvent.click(first);
  expect(write).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeVisible();
});

it('submits only canonical text once through the actual named SDK input', () => {
  const view = render(
    <form>
      <ShadcnInputMenu
        label="Destination"
        value="Paris"
        name="destination"
        items={items}
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(Array.from(new FormData(form))).toEqual([['destination', 'Paris']]);
});

it('validates readonly required text and focuses the actual SDK input', async () => {
  const submit = vi.fn();
  render(
    <ShadcnForm label="Journey" onSubmit={submit}>
      <ShadcnInputMenu
        label="Destination"
        value=""
        required
        readOnly
        items={items}
        onValueChange={vi.fn()}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'Destination' })).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter text');
});
