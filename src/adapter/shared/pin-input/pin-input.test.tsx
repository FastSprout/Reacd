import { useState } from 'react';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SharedPinInput } from './pin-input.adapter.js';

describe('shadcn PinInput', () => {
  it('preserves zeroes and completes only on user changes', async () => {
    const user = userEvent.setup();
    const complete = vi.fn();
    function Example() {
      const [value, setValue] = useState('0012');
      return (
        <SharedPinInput
          label="Code"
          value={value}
          length={4}
          otp
          description="Four digits"
          separatorEvery={2}
          required
          name="code"
          onValueChange={setValue}
          onComplete={complete}
        />
      );
    }
    render(<Example />);
    expect(complete).not.toHaveBeenCalled();
    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toHaveAccessibleDescription('Four digits');
    expect(input).toHaveValue('0012');
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    await user.clear(input);
    await user.type(input, '0042');
    expect(complete).toHaveBeenCalledExactlyOnceWith('0042');
    expect(input).toHaveValue('0042');
    await user.keyboard('{Backspace}');
    expect(input).toHaveValue('004');
  });
  it('normalizes pasted separators and rejects invalid characters', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState('');
      return <SharedPinInput label="Code" value={value} onValueChange={setValue} />;
    }
    render(<Example />);
    const input = screen.getByRole('textbox', { name: 'Code' });
    await user.click(input);
    await user.paste('12 3-456');
    expect(input).toHaveValue('123456');
    await user.clear(input);
    await user.type(input, 'a1!2');
    expect(input).toHaveValue('12');
    expect(input).toHaveAttribute('inputmode', 'numeric');
  });
  it('masks alphanumeric values and respects a host rejecting writes', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <SharedPinInput
        label="Secret"
        value="aB12"
        inputType="alphanumeric"
        length={4}
        mask
        onValueChange={change}
      />,
    );
    const input = screen.getByLabelText('Secret');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('inputmode', 'text');
    expect(screen.queryByText('a')).toBeNull();
    expect(screen.getAllByText('•')).toHaveLength(4);
    await user.clear(input);
    expect(change).toHaveBeenCalledWith('');
    expect(input).toHaveValue('aB12');
  });
  it.each([{ disabled: true }, { readOnly: true }])(
    'prevents changes and completion when protected: %j',
    (properties) => {
      const change = vi.fn();
      const complete = vi.fn();
      render(
        <SharedPinInput
          {...properties}
          label="Code"
          value=""
          onValueChange={change}
          onComplete={complete}
        />,
      );
      fireEvent.change(screen.getByRole('textbox', { name: 'Code' }), {
        target: { value: '123456' },
      });
      expect(change).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    },
  );
});
