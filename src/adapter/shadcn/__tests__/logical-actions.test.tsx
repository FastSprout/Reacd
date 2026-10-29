import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnButton } from '../button/button.adapter.js';
import { ShadcnUser } from '../user/user.adapter.js';

it('passes no native arguments to Button and User capabilities', async () => {
  const user = userEvent.setup();
  const press = vi.fn();
  const open = vi.fn();
  render(
    <>
      <ShadcnButton label="Run action" onPress={press} />
      <ShadcnUser name="Open account" onPress={open} />
    </>,
  );
  await user.click(screen.getByRole('button', { name: 'Run action' }));
  await user.click(screen.getByRole('button', { name: 'Open account' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(open).toHaveBeenCalledExactlyOnceWith();
});
