import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { useState } from 'react';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { InputMenu, ReacdProvider } from '../../../index.js';
import type { InputMenuProps } from '../../../components/input-menu/index.js';

const items = [
  { value: 'krakow', label: 'Kraków', description: 'Poland' },
  { value: 'paris', label: 'Paris' },
  { value: 'blocked', label: 'Unavailable', disabled: true },
];
const base = { label: 'Destination', items };

function Example(properties: Partial<InputMenuProps>) {
  const [value, setValue] = useState('');
  return (
    <ReacdProvider adapter={activeTestAdapter}>
      <InputMenu {...base} value={value} onValueChange={setValue} {...properties} />
    </ReacdProvider>
  );
}

it('keeps free text and maps suggestion keys to labels in logical order', async () => {
  const user = userEvent.setup();
  const events: unknown[] = [];
  render(
    <Example
      onSuggestionSelect={(...args) => {
        events.push(args);
      }}
      onValueChange={(...args) => {
        events.push(args);
      }}
    />,
  );
  const input = screen.getByRole('combobox', { name: 'Destination' });
  await user.click(input);
  await user.click(screen.getByRole('option', { name: /Kraków/ }));
  expect(events).toEqual([[{ value: 'krakow', text: 'Kraków' }], ['Kraków']]);
  expect(input).toHaveValue('');
});

it('vetoes suggestion requests before changing text or closing', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<Example onValueChange={change} onSuggestionSelect={() => false} />);
  await user.click(screen.getByRole('combobox', { name: 'Destination' }));
  await user.click(screen.getByRole('option', { name: /Paris/ }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeVisible();
});

it('blocks required read-only native submission and focuses the visible input', () => {
  render(
    <form aria-label="Trip">
      <Example required readOnly name="city" />
    </form>,
  );
  const form = screen.getByRole('form', { name: 'Trip' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form.');
  expect(form.checkValidity()).toBe(false);
  expect(screen.getByRole('combobox', { name: 'Destination' })).toHaveFocus();
  expect(Array.from(new FormData(form))).toEqual([['city', '']]);
});

it('does not commit or submit an IME Enter or legacy key 229', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<Example onValueChange={change} />);
  const input = screen.getByRole('combobox', { name: 'Destination' });
  await user.click(input);
  await user.keyboard('{ArrowDown}');
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, isComposing: true });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
  expect(change).not.toHaveBeenCalled();
});
