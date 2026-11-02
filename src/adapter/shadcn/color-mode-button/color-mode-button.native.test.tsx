import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnColorModeButton } from './color-mode-button.adapter.js';

it('uses an SDK button for controlled appearance', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnColorModeButton
      label="Appearance"
      value="system"
      resolvedMode="light"
      onValueChange={change}
      description="Choose a mode"
    />,
  );
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button').className).toContain('border-input');
  expect(screen.getByRole('button')).toHaveAccessibleDescription('Choose a mode');
  await userEvent.click(screen.getByRole('button', { name: 'Appearance' }));
  expect(change).toHaveBeenLastCalledWith('dark');
  view.rerender(
    <ShadcnColorModeButton
      label="Appearance"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Appearance' }));
  expect(change).toHaveBeenLastCalledWith('light');
  view.rerender(
    <ShadcnColorModeButton
      label="Appearance"
      value="dark"
      resolvedMode="dark"
      readOnly
      onValueChange={change}
    />,
  );
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
});
