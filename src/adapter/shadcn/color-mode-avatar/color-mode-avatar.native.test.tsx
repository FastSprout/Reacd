import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnColorModeAvatar } from './color-mode-avatar.adapter.js';

it('keeps the SDK avatar fallback while its controlled source changes', () => {
  const view = render(
    <ShadcnColorModeAvatar
      mode="light"
      light="/light.png"
      dark="/dark.png"
      name="Ada Lovelace"
    />,
  );
  expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute(
    'data-slot',
    'avatar',
  );
  expect(screen.getByText('AL')).toBeVisible();
  view.rerender(
    <ShadcnColorModeAvatar
      mode="dark"
      light="/light.png"
      dark="/dark.png"
      name="Ada Lovelace"
      fallback="A"
    />,
  );
  expect(screen.getByText('A')).toBeVisible();
});
