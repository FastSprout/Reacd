import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnTextarea } from './textarea.adapter.js';

it('uses native textarea properties without a custom resize engine', async () => {
  const change = vi.fn();
  const view = render(<ShadcnTextarea label="Notes" value="" onValueChange={change} />);
  const input = screen.getByRole('textbox', { name: 'Notes' });
  await userEvent.type(input, 'a');
  expect(change).toHaveBeenCalledWith('a');
  view.rerender(
    <ShadcnTextarea
      label="Notes"
      value="a"
      onValueChange={change}
      autoResize
      description="Project notes"
      maxRows={8}
    />,
  );
  expect(input).toHaveAccessibleDescription('Project notes');
  expect(input).toHaveAttribute('rows', '3');
});
