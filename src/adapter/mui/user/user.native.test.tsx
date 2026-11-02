import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiUser } from './user.adapter.js';

it('renders native identity actions, safe links and passive descriptions', async () => {
  const action = vi.fn();
  const view = render(<MuiUser name="Ada" description="Engineer" />);
  expect(screen.getByText('Ada')).toBeVisible();
  expect(screen.getByText('Ada').className).toContain('MuiTypography-root');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(<MuiUser name="Ada" href="/ada" avatar={{ fallback: 'A' }} />);
  expect(screen.getByRole('link', { name: 'Ada' })).toHaveAttribute('href', '/ada');
  expect(screen.getByRole('img', { name: 'Ada' })).toBeVisible();
  view.rerender(<MuiUser name="Ada" description="Engineer" onPress={action} />);
  await userEvent.click(screen.getByRole('button', { name: 'Ada' }));
  expect(action).toHaveBeenCalledWith();
  expect(screen.getByRole('button')).toHaveAccessibleDescription('Engineer');
  view.rerender(
    <MuiUser
      name="Ada"
      onPress={action}
      disabled
      orientation="vertical"
      size="large"
    />,
  );
  expect(screen.getByRole('button')).toBeDisabled();
});
