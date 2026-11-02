import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiColorModeSelect } from './color-mode-select.adapter.js';
it('uses native Material selection for color preferences', async () => {
  const change = vi.fn<(value: 'light' | 'dark' | 'system') => void>();
  const view = render(
    <MuiColorModeSelect
      label="Appearance"
      value="system"
      resolvedMode="light"
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Appearance' }));
  await userEvent.click(screen.getByRole('option', { name: 'Dark' }));
  expect(change).toHaveBeenCalledWith('dark');
  view.rerender(
    <MuiColorModeSelect
      label="Appearance"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
      labels={{ system: 'Device', light: 'Day', dark: 'Night' }}
    />,
  );
  expect(screen.getByRole('combobox', { name: 'Appearance' })).toHaveTextContent(
    'Night',
  );
});
