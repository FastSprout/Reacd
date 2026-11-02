import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputNumber } from './input-number.adapter.js';
it('uses the official MUI NumberField integration for bounded stepping', async () => {
  const change = vi.fn<(value: number | null) => void>();
  const view = render(
    <MuiInputNumber
      label="Quantity"
      value={2}
      min={0}
      max={3}
      step={1}
      onValueChange={change}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Quantity' });
  expect(input.closest('.MuiOutlinedInput-root')).not.toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Increase Quantity' }));
  expect(change).toHaveBeenCalledWith(3);
  view.rerender(
    <MuiInputNumber
      label="Quantity"
      value={3}
      min={0}
      max={3}
      onValueChange={change}
    />,
  );
  expect(screen.getByRole('button', { name: 'Increase Quantity' })).toBeDisabled();
});
it('delegates localized currency formatting and read-only state', async () => {
  const change = vi.fn<(value: number | null) => void>();
  render(
    <MuiInputNumber
      label="Price"
      value={1234.5}
      locale="de-DE"
      format={{ style: 'currency', currency: 'EUR' }}
      onValueChange={change}
      readOnly
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Price' });
  expect(input).toHaveValue('1.234,50 €');
  await userEvent.type(input, '2');
  expect(change).not.toHaveBeenCalled();
});

it('delegates fractional stepping and nullable values', async () => {
  const change = vi.fn<(value: number | null) => void>();
  const view = render(
    <MuiInputNumber
      label="Weight"
      value={1.5}
      min={0}
      max={3}
      step={0.5}
      onValueChange={change}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Weight' });
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}');
  expect(change).toHaveBeenLastCalledWith(1);
  view.rerender(
    <MuiInputNumber
      label="Weight"
      value={null}
      onValueChange={change}
      placeholder="Enter weight"
    />,
  );
  expect(input).toHaveValue('');
  await userEvent.type(input, '12');
  expect(change).toHaveBeenCalledWith(12);
});

it('passes required error metadata to native FormControl and input', () => {
  const view = render(
    <FieldMetadataContext
      value={{
        name: 'weight',
        required: true,
        disabled: false,
        error: 'Enter a weight',
        descriptionIds: ['external-help'],
      }}
    >
      <MuiInputNumber label="Weight" value={null} onValueChange={() => undefined} />
    </FieldMetadataContext>,
  );
  const input = screen.getByRole('textbox', { name: 'Weight' });
  expect(input).toHaveAttribute('required');
  expect(view.container.querySelector('input[name="weight"]')).toHaveAttribute(
    'type',
    'number',
  );
  expect(input).toHaveAttribute(
    'aria-describedby',
    expect.stringContaining('external-help'),
  );
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Enter a weight')).toBeVisible();
});
