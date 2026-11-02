import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnTextArea } from './text-area.adapter.js';

it('renders the official textarea for the legacy declaration', async () => {
  const change = vi.fn();
  render(<ShadcnTextArea label="Notes" value="" onValueChange={change} />);
  const input = screen.getByRole('textbox', { name: 'Notes' });
  expect(input.className).toContain('border-input');
  await userEvent.type(input, 'a');
  expect(change).toHaveBeenCalledWith('a');
});
