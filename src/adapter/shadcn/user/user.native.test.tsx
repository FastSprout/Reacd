import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnUser } from './user.adapter.js';

it('renders native identity actions, safe links and passive descriptions', async () => {
  const action = vi.fn();
  const view = render(<ShadcnUser name="Ada" description="Engineer" />);
  expect(screen.getByText('Ada')).toBeVisible();
  expect(screen.getByText('Ada')).toHaveAttribute('data-slot', 'field-label');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(<ShadcnUser name="Ada" href="/ada" avatar={{ fallback: 'A' }} />);
  expect(screen.getByRole('link', { name: 'Ada' })).toHaveAttribute('href', '/ada');
  expect(screen.getByRole('img', { name: 'Ada' })).toBeVisible();
  view.rerender(<ShadcnUser name="Ada" description="Engineer" onPress={action} />);
  await userEvent.click(screen.getByRole('button', { name: 'Ada' }));
  expect(action).toHaveBeenCalledWith();
  expect(screen.getByRole('button')).toHaveAccessibleDescription('Engineer');
  view.rerender(
    <ShadcnUser
      name="Ada"
      onPress={action}
      disabled
      orientation="vertical"
      size="large"
    />,
  );
  expect(screen.getByRole('button')).toBeDisabled();
});
