import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { nativeContentEntries } from './native-content.js';

it('registers the closed Image declaration with native shadcn loading', () => {
  render(nativeContentEntries.Image.render({
    src: '/workspace.svg', alt: 'Workspace',
  }));
  const image = screen.getByRole('img', { name: 'Workspace' });
  expect(image.parentElement).toHaveAttribute('data-slot', 'aspect-ratio');
  expect(image.parentElement).toHaveAttribute('aria-busy', 'true');
  fireEvent.load(image);
  expect(image.parentElement).toHaveAttribute('aria-busy', 'false');
});
