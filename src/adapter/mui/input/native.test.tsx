import { LAYOUT_POLICY } from '../../../core/policy.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInput } from './input.adapter.js';

it('uses Material TextField and keeps the callback value-only', async () => {
  const change = vi.fn<(value: string) => void>();
  const view = render(
    <MuiInput
      label="Email"
      value=""
      onValueChange={change}
      required
      description="Work address"
      inputType="email"
      maxLength={80}
    />,
  );
  const field = screen.getByRole('textbox', { name: 'Email' });
  expect(field.closest('.MuiTextField-root')).not.toBeNull();
  expect(field.closest('.MuiInputBase-root')).toHaveStyle({
    minHeight: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  expect(field).toHaveAttribute('type', 'email');
  expect(field).toHaveAttribute('required');
  expect(field).toHaveAttribute('maxlength', '80');
  expect(field).toHaveAccessibleDescription('Work address');
  await userEvent.type(field, 'a');
  expect(change).toHaveBeenCalledWith('a');
  view.rerender(<MuiInput label="Email" value="" onValueChange={change} readOnly />);
  await userEvent.type(field, 'b');
  expect(change).toHaveBeenCalledTimes(1);
});
