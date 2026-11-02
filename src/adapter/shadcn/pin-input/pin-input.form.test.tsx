import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnPinInput } from './pin-input.adapter.js';

it('validates optional fields and accepts complete edits', async () => {
  const user = userEvent.setup();
  const save = vi.fn();
  function Sample() {
    const [value, setValue] = useState('');
    return (
      <ShadcnForm label="Optional verification" onSubmit={save}>
        <ShadcnPinInput
          label="Code"
          value={value}
          length={4}
          onValueChange={setValue}
        />
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>
    );
  }
  render(<Sample />);
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
  const input = screen.getByRole('textbox', { name: 'Code' });
  await user.type(input, '01');
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).toHaveBeenCalledTimes(1);
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Enter the complete code.');
  await user.type(input, '23');
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledTimes(2));
  expect(input).toHaveValue('0123');
  expect(input).toHaveAttribute('aria-invalid', 'false');
});

it('inherits metadata and keeps blocked fields inert', () => {
  const change = vi.fn();
  const complete = vi.fn();
  render(
    <ShadcnFormField
      name="verification"
      required
      disabled
      error="Code expired"
      description="Request a fresh code"
    >
      <ShadcnPinInput
        label="Code"
        value=""
        onValueChange={change}
        onComplete={complete}
      />
    </ShadcnFormField>,
  );
  const input = screen.getByRole('textbox', { name: 'Code' });
  expect(input).toBeDisabled();
  expect(input).toHaveAttribute('name', 'verification');
  expect(input).toHaveAttribute('required');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Request a fresh code Code expired');
  fireEvent.change(input, { target: { value: '123456' } });
  expect(change).not.toHaveBeenCalled();
  expect(complete).not.toHaveBeenCalled();
});

it('does not complete on a host update and rejects invalid SDK input', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const complete = vi.fn();
  const view = render(
    <ShadcnPinInput
      label="Code"
      value=""
      onValueChange={change}
      onComplete={complete}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Code' });
  await user.type(input, 'A');
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnPinInput
      label="Code"
      value="123456"
      onValueChange={change}
      onComplete={complete}
    />,
  );
  expect(complete).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: '123456' } });
  expect(complete).not.toHaveBeenCalled();
});
