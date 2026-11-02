import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnInputNumber } from './input-number.adapter.js';

function Quantity() {
  const [value, change] = useState<number | null>(1.5);
  return (
    <ShadcnInputNumber
      label="Weight"
      value={value}
      onValueChange={change}
      min={0}
      max={2}
      step={0.5}
      description="In kilograms"
    />
  );
}

it('delegates fractional stepping, limits and keyboard to the SDK', async () => {
  render(<Quantity />);
  const input = screen.getByRole('textbox', { name: 'Weight' });
  expect(input.className).toContain('border-input');
  expect(input).toHaveAccessibleDescription('In kilograms');
  await userEvent.click(screen.getByRole('button', { name: 'Increase Weight' }));
  expect(input).toHaveValue('2');
  expect(screen.getByRole('button', { name: 'Increase Weight' })).toBeDisabled();
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}');
  expect(input).toHaveValue('1.5');
  await userEvent.click(screen.getByRole('button', { name: 'Decrease Weight' }));
  expect(input).toHaveValue('1');
});

it('keeps SDK locale formatting and readonly behavior', async () => {
  const change = vi.fn();
  render(
    <ShadcnInputNumber
      label="Price"
      value={1234.5}
      onValueChange={change}
      locale="de-DE"
      format={{ style: 'currency', currency: 'EUR' }}
      readOnly
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Price' });
  expect(input).toHaveValue('1.234,50 €');
  await userEvent.type(input, '2');
  expect(change).not.toHaveBeenCalled();
});

it('maps nullable values and inherited form metadata', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnInputNumber
      label="Quantity"
      value={null}
      onValueChange={change}
      placeholder="Enter a quantity"
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Quantity' });
  expect(input).toHaveValue('');
  expect(input).toHaveAttribute('placeholder', 'Enter a quantity');
  await userEvent.type(input, '12');
  expect(change).toHaveBeenCalledWith(12);
  view.rerender(
    <FieldMetadataContext
      value={{
        name: 'quantity',
        required: true,
        disabled: true,
        error: 'Quantity needed',
        descriptionIds: ['quantity-error'],
      }}
    >
      <ShadcnInputNumber label="Quantity" value={null} onValueChange={change} />
    </FieldMetadataContext>,
  );
  const inheritedInput = screen.getByRole('textbox', { name: 'Quantity' });
  expect(inheritedInput).toBeDisabled();
  expect(inheritedInput).toHaveAttribute('required');
  expect(inheritedInput).toHaveAttribute('aria-invalid', 'true');
  expect(inheritedInput).toHaveAttribute('aria-describedby', 'quantity-error');
  expect(view.container.querySelector('input[name="quantity"]')).not.toBeNull();
});

it('blocks hidden-portal changes through SDK disabled state', () => {
  const change = vi.fn();
  render(
    <PortalActiveContext value={false}>
      <ShadcnInputNumber label="Quantity" value={1} onValueChange={change} />
    </PortalActiveContext>,
  );
  const input = screen.getByRole('textbox', { name: 'Quantity' });
  expect(input).toBeDisabled();
  fireEvent.change(input, { target: { value: '2' } });
  expect(change).not.toHaveBeenCalled();
});
