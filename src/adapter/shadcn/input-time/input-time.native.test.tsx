import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputTime } from './input-time.adapter.js';

it('uses native second-precision time without timezone conversion', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnInputTime
      label="Arrival"
      value="12:30:45"
      onValueChange={change}
      name="arrival"
    />,
  );
  const second = screen.getByRole('spinbutton', { name: /second/i });
  await user.click(second);
  await user.keyboard('{ArrowUp}');
  expect(change).toHaveBeenLastCalledWith('12:30:46');
  expect(view.container.querySelector('input[name="arrival"]')).toHaveAttribute(
    'value',
    '12:30:45',
  );
  await user.click(screen.getByRole('button', { name: 'Clear Arrival' }));
  expect(change).toHaveBeenLastCalledWith(null);
});
