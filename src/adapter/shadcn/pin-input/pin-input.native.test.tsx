import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnPinInput } from './pin-input.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('preserves leading zeros, completion, paste and visual masking', async () => {
  const complete = vi.fn();
  const user = userEvent.setup();
  function Sample() {
    const [value, setValue] = useState('');
    return (
      <ShadcnPinInput
        label="Code"
        value={value}
        onValueChange={setValue}
        onComplete={complete}
        description="Use your code"
        separatorEvery={3}
        otp
      />
    );
  }
  const view = render(<Sample />);
  const input = screen.getByRole('textbox', { name: 'Code' });
  expect(input).toHaveAttribute('data-slot', 'input-otp');
  expect(input).toHaveAttribute('autocomplete', 'one-time-code');
  await user.click(input);
  await user.paste('00 12-34');
  expect(input).toHaveValue('001234');
  expect(complete).toHaveBeenCalledExactlyOnceWith('001234');
  view.rerender(
    <ShadcnPinInput
      label="Secret"
      value="001234"
      onValueChange={vi.fn()}
      mask
      onComplete={complete}
    />,
  );
  expect(screen.getByLabelText('Secret')).toHaveAttribute('type', 'password');
  expect(screen.getAllByText('•')).toHaveLength(6);
  expect(complete).toHaveBeenCalledTimes(1);
});

it('guards edits and validates partial codes in SDK forms', async () => {
  const user = userEvent.setup();
  const save = vi.fn();
  const change = vi.fn();
  const complete = vi.fn();
  const view = render(
    <ShadcnForm label="Verify" onSubmit={save}>
      <ShadcnPinInput
        label="Code"
        value="12"
        onValueChange={change}
        required
        name="code"
      />
      <ShadcnSubmitButton label="Verify code" />
    </ShadcnForm>,
  );
  await user.click(screen.getByRole('button', { name: 'Verify code' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Code')).toHaveFocus();
  view.rerender(
    <ShadcnPinInput
      label="Protected"
      value="A1"
      inputType="alphanumeric"
      length={4}
      onValueChange={change}
      onComplete={complete}
      readOnly
    />,
  );
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A1B2' } });
  expect(change).not.toHaveBeenCalled();
  expect(complete).not.toHaveBeenCalled();
});
