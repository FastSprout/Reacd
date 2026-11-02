import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiAvatar } from './avatar.adapter.js';
it('uses Material Avatar for initials and image lifecycle', () => {
  const view = render(<MuiAvatar name="Ada Chen" />);
  expect(screen.getByRole('img', { name: 'Ada Chen' }).className).toContain(
    'MuiAvatar-root',
  );
  expect(screen.getByText('AC')).toBeVisible();
  view.rerender(
    <MuiAvatar name="Ada Chen" fallback="AD" src="/ada.png" size="small" />,
  );
  expect(screen.getByRole('img', { name: 'Ada Chen' })).toBeVisible();
});
