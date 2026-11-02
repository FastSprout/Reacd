import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnColorModeSwitch } from './color-mode-switch.adapter.js';

it('uses an SDK switch for controlled appearance', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnColorModeSwitch
      label="Dark mode"
      value="system"
      resolvedMode="light"
      onValueChange={change}
      description="Device appearance"
    />,
  );
  expect(screen.getByRole('switch').className).toContain('peer');
  expect(screen.getByRole('switch')).toHaveAccessibleDescription('Device appearance');
  await userEvent.click(screen.getByRole('switch'));
  expect(change).toHaveBeenLastCalledWith('dark');
  view.rerender(
    <ShadcnColorModeSwitch
      label="Dark mode"
      value="dark"
      resolvedMode="dark"
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('switch'));
  expect(change).toHaveBeenLastCalledWith('light');
  view.rerender(
    <ShadcnColorModeSwitch
      label="Dark mode"
      value="dark"
      resolvedMode="dark"
      readOnly
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('switch'));
  expect(change).toHaveBeenCalledTimes(2);
});
