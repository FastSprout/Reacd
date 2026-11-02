import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiColorModeSwitch } from './color-mode-switch.adapter.js';
it('maps native Material Switch changes to explicit color preferences', async () => {
  const change = vi.fn<(value: 'light' | 'dark' | 'system') => void>();
  const view = render(
    <MuiColorModeSwitch
      label="Dark"
      value="system"
      resolvedMode="light"
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('switch', { name: 'Dark' }));
  expect(change).toHaveBeenCalledWith('dark');
  view.rerender(
    <MuiColorModeSwitch
      label="Dark"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('switch', { name: 'Dark' }));
  expect(change).toHaveBeenLastCalledWith('light');
});
