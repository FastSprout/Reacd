import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { SharedColorModeImage } from './color-mode-image.adapter.js';

it('reserves image geometry and resets loading and errors after source changes', () => {
  const props = {
    alt: 'Workspace illustration',
    light: '/light.svg',
    dark: '/dark.svg',
  };
  const view = render(<SharedColorModeImage {...props} mode="light" />);
  const image = view.container.querySelector('img');
  if (image === null) throw new Error('Mode image is missing.');
  expect(image).toHaveAttribute('width', '640');
  expect(image).toHaveAttribute('height', '360');
  expect(screen.getByRole('img')).toHaveAttribute('aria-busy', 'true');
  fireEvent.load(image);
  expect(screen.getByRole('img')).not.toHaveAttribute('aria-busy');
  fireEvent.error(image);
  expect(screen.getByRole('img')).toHaveTextContent('Image unavailable');
  view.rerender(<SharedColorModeImage {...props} mode="dark" aspect="square" />);
  const replacement = view.container.querySelector('img');
  expect(replacement).toHaveAttribute('src', '/dark.svg');
  expect(replacement).toHaveAttribute('width', '480');
  expect(screen.getByRole('img')).toHaveAttribute('aria-busy', 'true');
  expect(screen.queryByText(/Image unavailable/)).toBeNull();
});
