import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnColorModeImage } from './color-mode-image.adapter.js';

it('uses SDK aspect ratio for the actual controlled image and error feedback', () => {
  const view = render(
    <ShadcnColorModeImage
      alt="Architecture"
      mode="light"
      light="/light.svg"
      dark="/dark.svg"
    />,
  );
  const image = screen.getByRole('img', { name: 'Architecture' });
  expect(image).toHaveAttribute('src', '/light.svg');
  expect(image.parentElement).toHaveAttribute('data-slot', 'aspect-ratio');
  expect(image).toHaveAttribute('width', '640');
  fireEvent.error(image);
  expect(screen.getByRole('img', { name: 'Architecture' })).toHaveTextContent(
    'Image unavailable',
  );
  view.rerender(
    <ShadcnColorModeImage
      alt="Architecture"
      mode="dark"
      light="/light.svg"
      dark="/dark.svg"
      aspect="square"
    />,
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', '/dark.svg');
  expect(screen.getByRole('img')).toHaveAttribute('width', '480');
});
