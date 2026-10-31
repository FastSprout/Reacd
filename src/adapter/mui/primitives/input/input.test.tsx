import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputPrimitive } from './input.js';

it('forwards controlled input metadata and focuses the actual input', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const ref = vi.fn();
  const { container } = render(
    <MuiInputPrimitive
      ref={ref}
      aria-label="Email"
      value=""
      type="email"
      required
      name="email"
      onChange={change}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Email' });
  expect(ref).toHaveBeenCalledWith(input);
  expect(input).toHaveAttribute('name', 'email');
  expect(input).toHaveAttribute('required');
  expect(container.querySelector('.MuiOutlinedInput-root')).toBeInTheDocument();
  await user.type(input, 'x');
  expect(change).toHaveBeenCalledOnce();
});
