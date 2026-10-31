import { useState } from 'react';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SharedInputNumber } from './input-number.adapter.js';

describe('shadcn InputNumber', () => {
  it('steps decimal values without binary floating point drift', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState<number | null>(0.1);
      return (
        <SharedInputNumber
          label="Quantity"
          value={value}
          min={0}
          max={0.3}
          step={0.1}
          description="Decimal precision"
          onValueChange={(next) => {
            change(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Example />);
    const input = screen.getByRole('textbox', { name: 'Quantity' });
    expect(input).toHaveAccessibleDescription('Decimal precision');
    await user.click(screen.getByRole('button', { name: 'Increase Quantity' }));
    expect(change).toHaveBeenLastCalledWith(0.2);
    await user.click(screen.getByRole('button', { name: 'Increase Quantity' }));
    expect(change).toHaveBeenLastCalledWith(0.3);
    expect(screen.getByRole('button', { name: 'Increase Quantity' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Decrease Quantity' }));
    expect(change).toHaveBeenLastCalledWith(0.2);
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(change).toHaveBeenLastCalledWith(0.1);
    await user.keyboard('{Home}');
    expect(change).toHaveBeenLastCalledWith(0);
    await user.keyboard('{End}');
    expect(change).toHaveBeenLastCalledWith(0.3);
  });
  it('allows empty controlled values and locale-aware currency entry', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState<number | null>(12.5);
      return (
        <SharedInputNumber
          label="Amount"
          value={value}
          locale="de-DE"
          format={{ style: 'currency', currency: 'EUR' }}
          name="amount"
          required
          placeholder="Enter amount"
          onValueChange={(next) => {
            change(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Example />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    expect(input).toHaveValue('12,50 €');
    await user.clear(input);
    expect(change).toHaveBeenLastCalledWith(null);
    await user.type(input, '3,5');
    await user.tab();
    expect(change).toHaveBeenLastCalledWith(3.5);
    expect(input).toHaveValue('3,50 €');
  });
  it('lets a controlled host reject proposed writes', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<SharedInputNumber label="Fixed" value={5} onValueChange={change} />);
    await user.click(screen.getByRole('button', { name: 'Increase Fixed' }));
    expect(change).toHaveBeenCalledWith(6);
    expect(screen.getByRole('textbox', { name: 'Fixed' })).toHaveValue('5');
  });
  it.each([{ disabled: true }, { readOnly: true }])(
    'prevents changes when protected: %j',
    async (properties) => {
      const user = userEvent.setup();
      const change = vi.fn();
      render(
        <SharedInputNumber
          {...properties}
          label="Locked"
          value={5}
          onValueChange={change}
        />,
      );
      const input = screen.getByRole('textbox', { name: 'Locked' });
      await user.click(screen.getByRole('button', { name: 'Increase Locked' }));
      fireEvent.change(input, { target: { value: '8' } });
      expect(change).not.toHaveBeenCalled();
    },
  );
});
