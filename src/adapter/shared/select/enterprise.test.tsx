import { act, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedSelect } from './select.adapter.js';
import { SharedFormField } from '../form-field/form-field.adapter.js';

const ITEMS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'retired', label: 'Retired', disabled: true },
];

it('requests exact single values by keyboard and preserves host control', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <SharedSelect
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
    <SharedSelect
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
    <SharedSelect
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
    <SharedSelect
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
      <SharedSelect
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
      <SharedSelect
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
      <SharedSelect
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
      <SharedSelect
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
      <SharedFormField
        name="status"
        required
        description="Field help"
        error="Review pending"
      >
        <SharedSelect label="Status" value="a" items={ITEMS} onValueChange={vi.fn()} />
      </SharedFormField>
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
      <SharedFormField name="status" disabled required>
        <SharedSelect
          label="Status"
          value=""
          items={ITEMS}
          disabled={false}
          required={false}
          onValueChange={vi.fn()}
        />
      </SharedFormField>
    </form>,
  );
  expect(screen.getByRole('combobox')).toBeDisabled();
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([]);
  rerender(<SharedSelect label="Empty" value="" items={[]} onValueChange={vi.fn()} />);
  act(() => screen.getByRole('combobox').focus());
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('status')).toHaveTextContent('No options available.');
});
