import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnAvatar } from './avatar.adapter.js';

it('uses SDK Avatar fallback with canonical Unicode initials and sizing', () => {
  const view = render(<ShadcnAvatar name="Ada Lovelace" />);
  expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute(
    'data-slot',
    'avatar',
  );
  expect(screen.getByText('AL')).toHaveAttribute('data-slot', 'avatar-fallback');
  expect(screen.getByRole('img')).toHaveStyle({ width: '48px', height: '48px' });
  view.rerender(<ShadcnAvatar name="Lin" fallback="L" size="small" src="/lin.png" />);
  expect(screen.getByText('L')).toBeVisible();
  expect(screen.getByRole('img')).toHaveStyle({ width: '32px' });
});
