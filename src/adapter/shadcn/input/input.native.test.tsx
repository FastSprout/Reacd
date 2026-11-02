import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInput } from './input.adapter.js';

it('labels the official input and forwards controlled text changes', async () => {
  const change = vi.fn();
  const view = render(<ShadcnInput label="Email" value="" onValueChange={change} />);
  const input = screen.getByRole('textbox', { name: 'Email' });
  expect(input.className).toContain('border-input');
  await userEvent.type(input, 'a');
  expect(change).toHaveBeenCalledWith('a');
  view.rerender(
    <ShadcnInput
      label="Email"
      value="a"
      onValueChange={change}
      description="Team email"
      inputType="email"
      loading
    />,
  );
  expect(input).toHaveAttribute('readonly');
  expect(screen.getByRole('status')).toHaveTextContent('Updating Email');
  expect(input).toHaveAccessibleDescription('Team email');
});
