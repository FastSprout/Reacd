import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnPinInput } from './pin-input.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';

it('preserves named PIN values while submitting and only omits disabled fields', () => {
  const change = vi.fn();
  const complete = vi.fn();
  const submit = vi.fn();
  function Fields({ disabled = false }: { disabled?: boolean }) {
    return (
      <ShadcnForm label="Verification" onSubmit={submit} submitting>
        <ShadcnPinInput
          label="Code"
          name="code"
          value="001234"
          required
          disabled={disabled}
          onValueChange={change}
          onComplete={complete}
        />
      </ShadcnForm>
    );
  }
  const view = render(<Fields />);
  const form = screen.getByRole('form', { name: 'Verification' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  const input = screen.getByRole('textbox', { name: 'Code' });
  expect(form.querySelector('fieldset')).toHaveAttribute('inert');
  expect([...new FormData(form)]).toEqual([['code', '001234']]);
  expect(input).not.toBeDisabled();
  fireEvent.change(input, { target: { value: '999999' } });
  expect(change).not.toHaveBeenCalled();
  expect(complete).not.toHaveBeenCalled();
  expect([...new FormData(form)]).toEqual([['code', '001234']]);
  view.rerender(<Fields disabled />);
  expect(input).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
  expect(submit).not.toHaveBeenCalled();
});

it('excludes ancestor-disabled fields even when the local flag is false', () => {
  const change = vi.fn();
  const complete = vi.fn();
  render(
    <ShadcnForm label="Verification" onSubmit={vi.fn()}>
      <ShadcnFormField name="code" disabled>
        <ShadcnPinInput
          label="Code"
          value="001234"
          disabled={false}
          onValueChange={change}
          onComplete={complete}
        />
      </ShadcnFormField>
    </ShadcnForm>,
  );
  const form = screen.getByRole('form', { name: 'Verification' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  const input = screen.getByRole('textbox', { name: 'Code' });
  expect(input).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
  fireEvent.change(input, { target: { value: '999999' } });
  expect(change).not.toHaveBeenCalled();
  expect(complete).not.toHaveBeenCalled();
});
