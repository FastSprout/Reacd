import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiColorModeButton } from './color-mode-button.adapter.js';
it('uses native Material toggle-button state and value-only callbacks', async () => {
  const change = vi.fn<(value: 'light' | 'dark' | 'system') => void>();
  const view = render(
    <MuiColorModeButton
      label="Appearance"
      value="system"
      resolvedMode="light"
      onValueChange={change}
      description="Choose palette"
    />,
  );
  const button = screen.getByRole('button', { name: 'Appearance' });
  expect(button.className).toContain('MuiToggleButton-root');
  await userEvent.click(button);
  expect(change).toHaveBeenCalledWith('dark');
  view.rerender(
    <MuiColorModeButton
      label="Appearance"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
      readOnly
    />,
  );
  await userEvent.click(button);
  expect(change).toHaveBeenCalledTimes(1);
});
