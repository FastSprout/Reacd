import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiColorModeAvatar } from './color-mode-avatar.adapter.js';
it('changes the actual Material Avatar source for the resolved palette', () => {
  const view = render(
    <MuiColorModeAvatar name="Team" mode="light" light="/light.svg" dark="/dark.svg" />,
  );
  expect(
    screen.getByRole('img', { name: 'Team' }).querySelector('img'),
  ).toHaveAttribute('src', '/light.svg');
  view.rerender(
    <MuiColorModeAvatar name="Team" mode="dark" light="/light.svg" dark="/dark.svg" />,
  );
  expect(
    screen.getByRole('img', { name: 'Team' }).querySelector('img'),
  ).toHaveAttribute('src', '/dark.svg');
});
