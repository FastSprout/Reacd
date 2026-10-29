import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { InputMenu, ReacdProvider } from '../../../index.js';
import type { InputMenuProps } from '../../../components/input-menu/index.js';
import { inputMenuSchema } from '../../../schema/input-menu/index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const base = { label: 'Choice text', items, value: '' };

function Example(properties: Partial<InputMenuProps>) {
  const [value, setValue] = useState('');
  return (
    <ReacdProvider>
      <InputMenu {...base} value={value} onValueChange={setValue} {...properties} />
    </ReacdProvider>
  );
}

it('accepts free text, keyboard choice and clearing', async () => {
  const user = userEvent.setup();
  render(<Example description="Pick a suggestion or type your own." />);
  const input = screen.getByRole('combobox', { name: base.label });
  await user.type(input, 'Custom');
  expect(input).toHaveValue('Custom');
  expect(screen.getByText('No matching suggestions.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: `Clear text: ${base.label}` }));
  expect(input).toHaveValue('');
  await user.click(input);
  await user.keyboard('{ArrowDown}{Enter}');
  expect(input).toHaveValue('Alpha');
  await user.tab();
  expect(input).toHaveValue('Alpha');
});

it('reports callback failures and keeps rejected activations open', async () => {
  const user = userEvent.setup();
  const properties = inputMenuSchema.parse({
    ...base,
    onValueChange: () => Promise.resolve(true),
  });
  const view = render(
    <ReacdProvider>
      <InputMenu {...properties} />
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: base.label });
  await user.click(input);
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(input).toHaveValue('');
  expect(screen.getByRole('alert')).toHaveTextContent('boolean or no value');
  expect(screen.getByRole('listbox')).toBeVisible();
  view.rerender(
    <Example
      onSuggestionSelect={() => {
        throw new Error('Declined');
      }}
    />,
  );
  await user.click(screen.getByRole('combobox', { name: base.label }));
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(screen.getByRole('alert')).toHaveTextContent('could not be completed');
});

it('notifies unchanged labels without duplicating the text write', async () => {
  const user = userEvent.setup();
  const select = vi.fn();
  const change = vi.fn();
  render(<Example value="Alpha" onValueChange={change} onSuggestionSelect={select} />);
  await user.click(screen.getByRole('combobox', { name: base.label }));
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(select).toHaveBeenCalledExactlyOnceWith({ value: 'a', text: 'Alpha' });
  expect(change).not.toHaveBeenCalled();
});

it('honors controlled open veto and closes without clearing on Escape', async () => {
  const user = userEvent.setup();
  const disclosure = vi.fn<(open: boolean) => boolean>(() => false);
  const view = render(<Example open onOpenChange={disclosure} value="Alpha" />);
  const input = screen.getByRole('combobox', { name: base.label });
  await user.click(input);
  await user.keyboard('{Escape}');
  expect(disclosure).toHaveBeenCalledWith(false);
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(input).toHaveValue('Alpha');
  view.rerender(<Example value="Alpha" />);
  await user.click(input);
  await user.keyboard('{Escape}');
  expect(input).toHaveValue('Alpha');
  expect(screen.queryByRole('listbox')).toBeNull();
  await waitFor(() => expect(document.querySelector('[role="listbox"]')).toBeNull());
  await user.keyboard('{Escape}');
  expect(input).toHaveValue('Alpha');
});

it('supports composition final text once, including legacy Enter suppression', () => {
  const change = vi.fn();
  render(<Example onValueChange={change} />);
  const input = screen.getByRole('combobox', { name: base.label });
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: '東' } });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
  expect(change).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input, { target: { value: '東京' } });
  expect(change).toHaveBeenCalledExactlyOnceWith('東京');
});

it('suppresses hidden/disabled callbacks and permits readonly browsing', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(<Example readOnly onValueChange={change} />);
  const input = screen.getByRole('combobox', { name: base.label });
  await user.click(input);
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(<Example disabled value="Alpha" onValueChange={change} />);
  expect(input).toBeDisabled();
  view.rerender(
    <PortalActiveContext.Provider value={false}>
      <Example open onOpenChange={change} />
    </PortalActiveContext.Provider>,
  );
  expect(screen.queryByRole('listbox')).toBeNull();
  expect(change).not.toHaveBeenCalled();
});
