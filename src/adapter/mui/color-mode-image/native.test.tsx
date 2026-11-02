import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiColorModeImage } from './color-mode-image.adapter.js';
it('resets native image failure when the selected source changes', () => {
  const view = render(
    <MuiColorModeImage
      alt="Workspace"
      mode="light"
      light="/light.svg"
      dark="/dark.svg"
    />,
  );
  const image = screen.getByRole('img', { name: 'Workspace' });
  expect(image.className).toContain('MuiBox-root');
  expect(image).toHaveAttribute('width', '640');
  fireEvent.error(image);
  expect(screen.getByText('Image unavailable')).toBeVisible();
  view.rerender(
    <MuiColorModeImage
      alt="Workspace"
      mode="dark"
      aspect="square"
      light="/light.svg"
      dark="/dark.svg"
    />,
  );
  expect(screen.getByRole('img', { name: 'Workspace' })).toHaveAttribute(
    'src',
    '/dark.svg',
  );
});
