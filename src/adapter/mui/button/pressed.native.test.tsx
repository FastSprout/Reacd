import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiButton } from './button.adapter.js';

it.each([false, true])('keeps controlled state with iconOnly=%s', async (iconOnly) => {
  const press = vi.fn();
  const properties = { label: 'Mono', onPress: press, iconOnly,
    leadingIcon: 'settings' } as const;
  const view = render(<MuiButton {...properties} pressed={false} />);
  const button = screen.getByRole('button', { name: 'Mono', pressed: false });
  await userEvent.click(button);
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(button).toHaveAttribute('aria-pressed', 'false');
  view.rerender(<MuiButton {...properties} pressed />);
  expect(screen.getByRole('button', { name: 'Mono', pressed: true })).toBe(button);
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard(' ');
  expect(press).toHaveBeenCalledTimes(3);
  expect(button).toHaveAttribute('aria-pressed', 'true');
  view.rerender(<MuiButton {...properties} />);
  expect(button).not.toHaveAttribute('aria-pressed');
});
