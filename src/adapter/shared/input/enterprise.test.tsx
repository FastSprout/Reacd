import {
  act,
  fireEvent,
  render,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { SharedInput } from './input.adapter.js';
import { SharedFormField } from '../form-field/form-field.adapter.js';

it('guards edits/loading and preserves authoritative values', () => {
  const change = vi.fn();
  const { rerender } = render(
    <SharedInput
      label="Email"
      value="kept"
      onValueChange={change}
      maxLength={8}
      description="Sign-in email"
    />,
  );
  const control = screen.getByRole('textbox');
  expect(control).toHaveAccessibleDescription('Sign-in email');
  fireEvent.change(control, { target: { value: 'draft' } });
  expect(change.mock.calls).toEqual([['draft']]);
  expect(control).toHaveValue('kept');
  fireEvent.change(control, { target: { value: 'over budget' } });
  expect(change).toHaveBeenCalledTimes(1);
  for (const protection of [
    { disabled: true },
    { readOnly: true },
    { loading: true },
  ]) {
    rerender(
      <SharedInput label="Email" value="kept" onValueChange={change} {...protection} />,
    );
    fireEvent.change(control, { target: { value: 'new value' } });
    expect(change).toHaveBeenCalledTimes(1);
  }
  expect(screen.getByRole('status')).toHaveTextContent('Updating Email');
});

it('validates readonly email/minimum/required and serializes canonical state', () => {
  const { container, rerender } = render(
    <form>
      <SharedInput
        label="Email"
        value=""
        required
        readOnly
        inputType="email"
        onValueChange={vi.fn()}
        name="email"
      />
    </form>,
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Missing form');
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('textbox')).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
  rerender(
    <form>
      <SharedInput
        label="Email"
        value="short"
        minLength={8}
        readOnly
        inputType="email"
        onValueChange={vi.fn()}
        name="email"
      />
    </form>,
  );
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 8 characters.');
  rerender(
    <form>
      <SharedInput
        label="Email"
        value="invalid-email"
        readOnly
        inputType="email"
        onValueChange={vi.fn()}
        name="email"
      />
    </form>,
  );
  act(() => {
    expect(form.checkValidity()).toBe(false);
  });
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
  rerender(
    <form>
      <SharedInput
        label="Email"
        value="owner@example.com"
        readOnly
        inputType="email"
        onValueChange={vi.fn()}
        name="email"
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([['email', 'owner@example.com']]);
});

it('inherits field metadata and preserves disabled safety and optional drafts', () => {
  const { container, rerender } = render(
    <form>
      <SharedFormField
        name="field"
        required
        description="Field help"
        error="Server error"
      >
        <SharedInput
          label="Input"
          value=""
          required={false}
          name="explicit"
          onValueChange={vi.fn()}
        />
      </SharedFormField>
    </form>,
  );
  const input = screen.getByRole('textbox');
  expect(input).toHaveAttribute('name', 'explicit');
  expect(input).not.toHaveAttribute('required');
  expect(input).toHaveAccessibleDescription('Field help Server error');
  const form = container.querySelector('form');
  if (form === null) throw new Error('Missing form');
  expect(form.checkValidity()).toBe(false);
  rerender(
    <form>
      <SharedFormField name="field" required disabled>
        <SharedInput label="Input" value="" disabled={false} onValueChange={vi.fn()} />
      </SharedFormField>
    </form>,
  );
  expect(input).toBeDisabled();
  expect(form.checkValidity()).toBe(true);
  expect([...new FormData(form)]).toEqual([]);
  rerender(
    <form>
      <SharedInput
        label="Input"
        value=""
        minLength={8}
        inputType="email"
        onValueChange={vi.fn()}
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
});
