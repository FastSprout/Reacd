import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnInputNumber } from './input-number.adapter.js';

it('preserves named numeric values while the Form is submitting', () => {
  const change = vi.fn();
  const view = render(<ShadcnForm label="Quantity" onSubmit={vi.fn()} submitting>
    <ShadcnInputNumber label="Amount" name="quantity" value={1.5}
      onValueChange={change} />
  </ShadcnForm>);
  const form = screen.getByRole('form', { name: 'Quantity' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  const input = screen.getByRole('textbox', { name: 'Amount' });
  expect(form.querySelector('fieldset')).toHaveAttribute('inert');
  expect([...new FormData(form)]).toEqual([['quantity', '1.5']]);
  expect(input).not.toBeDisabled();
  fireEvent.change(input, { target: { value: '2' } });
  expect(change).not.toHaveBeenCalled();
  view.rerender(<ShadcnForm label="Quantity" onSubmit={vi.fn()} submitting>
    <ShadcnInputNumber label="Amount" name="quantity" value={1.5} disabled
      onValueChange={change} />
  </ShadcnForm>);
  expect(input).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
});

it('omits inherited disabled numeric fields even when locally enabled', () => {
  render(<ShadcnForm label="Quantity" onSubmit={vi.fn()}>
    <ShadcnFormField name="quantity" disabled>
      <ShadcnInputNumber label="Amount" value={1.5} disabled={false}
        onValueChange={vi.fn()} />
    </ShadcnFormField>
  </ShadcnForm>);
  const form = screen.getByRole('form', { name: 'Quantity' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect(screen.getByRole('textbox', { name: 'Amount' })).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
});
