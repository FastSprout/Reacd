import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnCheckbox } from './checkbox.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';

it('requests boolean writes without mutating mixed state', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ShadcnCheckbox
      label="Approve"
      checked={false}
      indeterminate
      description="Approve selected accounts"
      onCheckedChange={change}
    />,
  );
  const control = screen.getByRole('checkbox', { name: 'Approve' });
  expect(control).toHaveAttribute('aria-checked', 'mixed');
  expect(control).toHaveAccessibleDescription('Approve selected accounts');
  await user.click(control);
  expect(change.mock.calls).toEqual([[true]]);
  expect(control).toHaveAttribute('aria-checked', 'mixed');
  await user.click(screen.getByText('Approve'));
  control.focus();
  await user.keyboard(' ');
  expect(change.mock.calls).toEqual([[true], [true], [true]]);
  await user.keyboard('{Enter}');
  expect(change).toHaveBeenCalledTimes(3);
});

it.each([{ disabled: true }, { readOnly: true }])(
  'guards protected writes: %j',
  (protection) => {
    const change = vi.fn();
    render(
      <ShadcnCheckbox
        label="Protected"
        checked
        onCheckedChange={change}
        {...protection}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(change).not.toHaveBeenCalled();
  },
);

it('validates readonly mixed state and submits accepted values', () => {
  const { container, rerender } = render(
    <form>
      <ShadcnCheckbox
        label="Approve"
        checked
        indeterminate
        required
        readOnly
        name="approval"
        onCheckedChange={vi.fn()}
      />
    </form>,
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Missing form');
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('checkbox')).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Select this option');
  expect([...new FormData(form)]).toEqual([]);
  rerender(
    <form>
      <ShadcnCheckbox
        label="Approve"
        checked
        required
        readOnly
        name="approval"
        value="accepted"
        onCheckedChange={vi.fn()}
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([['approval', 'accepted']]);
  expect(screen.queryByRole('alert')).toBeNull();
});

it('inherits field metadata and protects inherited disabled state', () => {
  const { container, rerender } = render(
    <form>
      <ShadcnFormField
        name="field"
        required
        error="Review pending"
        description="Field guidance"
      >
        <ShadcnCheckbox
          label="Approve"
          checked
          description="Own guidance"
          onCheckedChange={vi.fn()}
        />
      </ShadcnFormField>
    </form>,
  );
  const control = screen.getByRole('checkbox');
  expect(control).toHaveAttribute('aria-required', 'true');
  expect(control).toHaveAccessibleDescription(
    'Field guidance Review pending Own guidance',
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Missing form');
  expect([...new FormData(form)]).toEqual([['field', 'on']]);
  rerender(
    <form>
      <ShadcnFormField name="field" required disabled>
        <ShadcnCheckbox
          label="Approve"
          checked={false}
          required={false}
          disabled={false}
          name="explicit"
          onCheckedChange={vi.fn()}
        />
      </ShadcnFormField>
    </form>,
  );
  expect(control).toBeDisabled();
  expect(control).not.toHaveAttribute('aria-required');
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([]);
});
