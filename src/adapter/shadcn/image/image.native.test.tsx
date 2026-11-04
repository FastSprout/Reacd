import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { COLOR_MODE_POLICY } from '../../../core/color-mode-policy.js';
import { ShadcnImage } from './image.adapter.js';

it('reserves the SDK landscape frame while the named image loads', () => {
  render(<ShadcnImage src="/workspace.svg" alt="Workspace layout" />);
  const image = screen.getByRole('img', { name: 'Workspace layout' });
  const frame = image.closest('[aria-busy]');
  expect(frame).toHaveAttribute('data-slot', 'aspect-ratio');
  expect(frame).toHaveAttribute('aria-busy', 'true');
  expect(image).toHaveAttribute('src', '/workspace.svg');
  expect(image).toHaveAttribute('width', '640');
  expect(image).toHaveAttribute('height', '360');
  expect(image.className).toContain('object-contain');
  fireEvent.load(image);
  expect(frame).toHaveAttribute('aria-busy', 'false');
  expect(screen.getByRole('img', { name: 'Workspace layout' })).toBe(image);
});

it.each(['square', 'portrait'] as const)(
  'reserves the named %s dimensions without cropping',
  (aspect) => {
    render(<ShadcnImage src="/workspace.svg" alt="Workspace" aspect={aspect} />);
    const image = screen.getByRole('img', { name: 'Workspace' });
    const dimensions = COLOR_MODE_POLICY.imageAspects[aspect];
    expect(image).toHaveAttribute('width', String(dimensions.width));
    expect(image).toHaveAttribute('height', String(dimensions.height));
    expect(image.className).toContain('object-contain');
  },
);

it('reports accessible failure and resets it for a new source', () => {
  const view = render(<ShadcnImage src="/missing.svg" alt="Workspace" />);
  const image = screen.getByRole('img', { name: 'Workspace' });
  fireEvent.error(image);
  const failure = screen.getByRole('img', { name: 'Workspace' });
  expect(failure).toHaveTextContent(COLOR_MODE_POLICY.imageFallback);
  expect(failure).toHaveAccessibleDescription(COLOR_MODE_POLICY.imageFallback);
  expect(failure.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
  expect(failure).not.toHaveAttribute('src');
  expect(failure.parentElement).not.toHaveAttribute('data-slot', 'aspect-ratio');
  expect(failure.parentElement).toHaveAttribute('aria-busy', 'false');
  expect(failure.parentElement?.className).toContain('bg-card');
  expect(failure.className).toContain('[overflow-wrap:anywhere]');
  expect(failure.className).not.toContain('h-full');
  view.rerender(<ShadcnImage src="/recovered.svg" alt="Recovered workspace" />);
  const recovered = screen.getByRole('img', { name: 'Recovered workspace' });
  expect(recovered).toHaveAttribute('src', '/recovered.svg');
  expect(recovered.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
  fireEvent.load(recovered);
  expect(recovered.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
});

it('keeps the current loading source isolated from detached source events', () => {
  const view = render(<ShadcnImage src="/first.svg" alt="Workspace" />);
  const previous = screen.getByRole('img', { name: 'Workspace' });
  fireEvent.load(previous);
  view.rerender(<ShadcnImage src="/second.svg" alt="Workspace" />);
  const current = screen.getByRole('img', { name: 'Workspace' });
  expect(current).not.toBe(previous);
  fireEvent.error(previous);
  fireEvent.load(previous);
  expect(current).toHaveAttribute('src', '/second.svg');
  expect(current.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
  fireEvent.load(current);
  expect(current.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
});
