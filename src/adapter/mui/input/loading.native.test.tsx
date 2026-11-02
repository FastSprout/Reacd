import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInput } from './input.adapter.js';

it('announces loading while retaining readonly canonical data', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <form aria-label="Contact">
      <MuiInput
        label="Email"
        value="ada@example.com"
        name="email"
        loading
        onValueChange={change}
      />
    </form>,
  );
  const input = screen.getByRole('textbox', { name: 'Email' });
  const progress = screen.getByRole('progressbar', { name: 'Updating Email' });
  expect(progress.closest('[aria-busy=true], [inert], :disabled')).toBeNull();
  expect(input).toHaveAttribute('aria-busy', 'true');
  expect(input).toHaveAttribute('readonly');
  await userEvent.type(input, 'x');
  expect(change).not.toHaveBeenCalled();
  const form = screen.getByRole('form', { name: 'Contact' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form.');
  expect(new FormData(form).get('email')).toBe('ada@example.com');
});
