import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnColorModeButton } from './color-mode-button.adapter.js';

it('requests opposite modes without forwarding native event arguments', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ShadcnColorModeButton
      label="Dark appearance"
      value="system"
      resolvedMode="light"
      onValueChange={change}
    />,
  );
  const button = screen.getByRole('button', { name: 'Dark appearance' });
  await user.click(button);
  expect(change).toHaveBeenCalledExactlyOnceWith('dark');
  expect(button).toHaveAttribute('aria-pressed', 'false');
  view.rerender(
    <ShadcnColorModeButton
      label="Dark appearance"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
    />,
  );
  await user.click(button);
  expect(change).toHaveBeenLastCalledWith('light');
  view.rerender(
    <ShadcnColorModeButton
      label="Dark appearance"
      description="Palette"
      value="dark"
      resolvedMode="dark"
      readOnly
      onValueChange={change}
    />,
  );
  await user.click(button);
  expect(change).toHaveBeenCalledTimes(2);
  expect(button).toHaveAccessibleDescription('Palette');
  view.rerender(
    <ShadcnColorModeButton
      label="Dark appearance"
      value="dark"
      resolvedMode="dark"
      disabled
      onValueChange={change}
    />,
  );
  expect(button).toBeDisabled();
});

