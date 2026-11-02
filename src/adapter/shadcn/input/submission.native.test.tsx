import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnInput } from './input.adapter.js';

it.each([
  ['', 'Enter a value.'],
  ['ab', 'Enter at least 4 characters.'],
  ['invalid', 'Enter a valid email address.'],
])(
  'validates readonly canonical value %s and clears host recovery',
  async (value, message) => {
    const submit = vi.fn();
    const content = (text: string) => (
      <ShadcnForm label="Contact" onSubmit={submit}>
        <ShadcnInput
          label="Email"
          value={text}
          onValueChange={() => undefined}
          inputType="email"
          required
          minLength={4}
          readOnly
          name="contact"
        />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    );
    const view = render(content(value));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(submit).not.toHaveBeenCalled();
    const input = screen.getByRole('textbox', { name: 'Email' });
    await waitFor(() => expect(input).toHaveFocus());
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(message);
    view.rerender(content('owner@example.com'));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledExactlyOnceWith();
  },
);

it('retains loading FormData and reports status while rejecting edits', async () => {
  const submit = vi.fn();
  const change = vi.fn();
  render(
    <ShadcnForm label="Contact" onSubmit={submit}>
      <ShadcnInput
        label="Email"
        value="owner@example.com"
        onValueChange={change}
        name="contact"
        inputType="email"
        loading
        required
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  const input = screen.getByRole('textbox', { name: 'Email' });
  const form = screen.getByRole('form', { name: 'Contact' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
  expect(new FormData(form).get('contact')).toBe('owner@example.com');
  expect(input).toHaveAttribute('readonly');
  expect(input).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('Updating Email');
  await userEvent.type(input, 'x');
  fireEvent.change(input, { target: { value: 'attacker@example.com' } });
  expect(change).not.toHaveBeenCalled();
  expect(input).toHaveValue('owner@example.com');
  expect(new FormData(form).get('contact')).toBe('owner@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
});

it('preserves native invalid reporting and disabled omission', async () => {
  const submit = vi.fn();
  const content = (disabled: boolean) => (
    <ShadcnForm label="Contact" onSubmit={submit}>
      <ShadcnInput
        label="Email"
        value=""
        onValueChange={() => undefined}
        name="contact"
        inputType="email"
        required
        disabled={disabled}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>
  );
  const view = render(content(false));
  const input = screen.getByRole('textbox', { name: 'Email' });
  fireEvent.invalid(input);
  expect(await screen.findByRole('alert')).toHaveTextContent('Enter a value.');
  const form = screen.getByRole('form', { name: 'Contact' });
  expect(form).not.toHaveAttribute('novalidate');
  view.rerender(content(true));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
  expect(new FormData(form).has('contact')).toBe(false);
});

it('preserves one controlled field error until host correction', async () => {
  const submit = vi.fn();
  const content = (error: string | undefined) => (
    <ShadcnForm label="Contact" onSubmit={submit}>
      <ShadcnFormField name="email" error={error}>
        <ShadcnInput
          label="Email"
          value="owner@example.com"
          readOnly
          onValueChange={() => undefined}
        />
      </ShadcnFormField>
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>
  );
  const view = render(content('Account is locked.'));
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  view.rerender(content(undefined));
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
});
