import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiTextArea } from './text-area.adapter.js';
it('maps the basic multiline alias to a Material TextField', async () => {
  const change = vi.fn<(value: string) => void>();
  render(<MuiTextArea label="Message" value="" onValueChange={change} rows={4} />);
  const field = screen.getByRole('textbox', { name: 'Message' });
  expect(field.closest('.MuiTextField-root')).not.toBeNull();
  expect(field).toHaveAttribute('rows', '4');
  await userEvent.type(field, 'a');
  expect(change).toHaveBeenCalledWith('a');
});
