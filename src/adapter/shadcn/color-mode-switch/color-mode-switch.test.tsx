import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnColorModeSwitch } from './color-mode-switch.adapter.js';

it('adapts the switch boolean into one logical preference value', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ShadcnColorModeSwitch
      label="Dark palette"
      value="system"
      resolvedMode="light"
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('switch', { name: 'Dark palette' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('dark');
  view.rerender(
    <ShadcnColorModeSwitch
      label="Dark palette"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('switch', { name: 'Dark palette' }));
  expect(change).toHaveBeenLastCalledWith('light');
});

