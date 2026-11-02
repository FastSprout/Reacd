import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnToggle } from './toggle.adapter.js';

it('uses the official SDK switch for toggle intent', async () => {
  const change = vi.fn();
  render(<ShadcnToggle label="Updates" checked={false} onCheckedChange={change} />);
  const control = screen.getByRole('switch', { name: 'Updates' });
  expect(control.className).toContain('rounded-full');
  await userEvent.click(control);
  expect(change).toHaveBeenCalledWith(true);
});
