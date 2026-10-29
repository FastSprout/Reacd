import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSelect } from './select.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';

const ITEMS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'retired', label: 'Retired', disabled: true },
];

it('requests exact single values by keyboard and preserves host control', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <ShadcnSelect
      label="Status"
      value="a"
      items={ITEMS}
      onValueChange={change}
      clearable
      description="Business status"
    />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Status' });
  expect(trigger).toHaveAccessibleDescription('Business status');
  act(() => trigger.focus());
  await user.keyboard('{ArrowDown}');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(change.mock.calls).toEqual([['b']]);
  expect(trigger).toHaveTextContent('Alpha');
  rerender(
    <ShadcnSelect
      label="Status"
      value="b"
      items={ITEMS}
      onValueChange={change}
      clearable
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Clear Status' }));
  expect(change.mock.calls).toEqual([['b'], ['']]);
});

it('requests readonly arrays and retains disabled selections', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <ShadcnSelect
      mode="multiple"
      label="Statuses"
      value={['a']}
      items={ITEMS}
      onValueChange={change}
      clearable
    />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Statuses' });
  act(() => trigger.focus());
  await user.keyboard('{ArrowDown}');
  await user.click(screen.getByRole('option', { name: 'Beta' }));
  expect(change.mock.calls).toEqual([[['a', 'b']]]);
  expect(Object.isFrozen(change.mock.calls[0]?.[0])).toBe(true);
  await user.keyboard('{Escape}');
  rerender(
    <ShadcnSelect
      mode="multiple"
      label="Statuses"
      value={['a', 'b', 'retired']}
      items={ITEMS}
      onValueChange={change}
      clearable
    />,
  );
  expect(trigger).toHaveTextContent('3 selected');
  await user.click(screen.getByRole('button', { name: 'Clear Statuses' }));
  expect(change.mock.calls).toEqual([[['a', 'b']], [[]]]);
});

it.each([{ readOnly: true }, { loading: true }, { disabled: true }])(
  'preserves canonical state while protected: %j',
  async (protection) => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ShadcnSelect
        label="Protected"
        value="a"
        items={ITEMS}
        onValueChange={change}
        clearable
        {...protection}
      />,
    );
    const trigger = screen.getByRole('combobox');
    act(() => trigger.focus());
    await user.keyboard('{ArrowDown}');
    if (!('disabled' in protection)) {
      expect(screen.getByRole('listbox')).toBeVisible();
      await user.click(screen.getByRole('option', { name: 'Beta' }));
    }
    expect(change).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent('Alpha');
    expect(screen.getByRole('button', { name: 'Clear Protected' })).toBeDisabled();
    if ('loading' in protection)
      expect(screen.getByRole('status')).toHaveTextContent('Loading options.');
  },
);

it('validates readonly data and serializes canonical keys', () => {
  const { container, rerender } = render(
    <form>
      <ShadcnSelect
        label="Status"
        value=""
        items={ITEMS}
        name="status"
        required
        readOnly
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Missing form');
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('combobox')).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
  expect([...new FormData(form)]).toEqual([['status', '']]);
  rerender(
    <form>
      <ShadcnSelect
        mode="multiple"
        label="Statuses"
        value={['a', 'retired']}
        items={ITEMS}
        name="statuses"
        required
        readOnly
        onValueChange={vi.fn()}
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([
    ['statuses', 'a'],
    ['statuses', 'retired'],
  ]);
  rerender(
    <form>
      <ShadcnSelect
        mode="multiple"
        label="Statuses"
        value={[]}
        items={ITEMS}
        name="statuses"
        required
        readOnly
        onValueChange={vi.fn()}
      />
    </form>,
  );
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('alert')).toHaveTextContent('Choose at least one option');
});

it('inherits field metadata and announces an empty catalog', async () => {
  const user = userEvent.setup();
  const { container, rerender } = render(
    <form>
      <ShadcnFormField
        name="status"
        required
        description="Field help"
        error="Review pending"
      >
        <ShadcnSelect label="Status" value="a" items={ITEMS} onValueChange={vi.fn()} />
      </ShadcnFormField>
    </form>,
  );
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
    'Field help Review pending',
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Missing form');
  expect([...new FormData(form)]).toEqual([['status', 'a']]);
  rerender(
    <form>
      <ShadcnFormField name="status" disabled required>
        <ShadcnSelect
          label="Status"
          value=""
          items={ITEMS}
          disabled={false}
          required={false}
          onValueChange={vi.fn()}
        />
      </ShadcnFormField>
    </form>,
  );
  expect(screen.getByRole('combobox')).toBeDisabled();
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([]);
  rerender(<ShadcnSelect label="Empty" value="" items={[]} onValueChange={vi.fn()} />);
  act(() => screen.getByRole('combobox').focus());
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('status')).toHaveTextContent('No options available.');
});
