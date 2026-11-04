import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { COLOR_MODE_POLICY } from '../../../core/color-mode-policy.js';
import { MuiImage } from './image.adapter.js';

it('reserves the SDK landscape frame while the named image loads', () => {
  render(<MuiImage src="/workspace.svg" alt="Workspace layout" />);
  const image = screen.getByRole('img', { name: 'Workspace layout' });
  const frame = image.closest('[aria-busy]');
  expect(image.className).toContain('MuiBox-root');
  expect(frame).toHaveAttribute('aria-busy', 'true');
  expect(image).toHaveAttribute('src', '/workspace.svg');
  expect(image).toHaveAttribute('width', '640');
  expect(image).toHaveAttribute('height', '360');
  expect(image).toHaveStyle({ objectFit: 'contain' });
  fireEvent.load(image);
  expect(frame).toHaveAttribute('aria-busy', 'false');
  expect(screen.getByRole('img', { name: 'Workspace layout' })).toBe(image);
});

it.each(['square', 'portrait'] as const)(
  'reserves the named %s dimensions without cropping',
  (aspect) => {
    render(<MuiImage src="/workspace.svg" alt="Workspace" aspect={aspect} />);
    const image = screen.getByRole('img', { name: 'Workspace' });
    const dimensions = COLOR_MODE_POLICY.imageAspects[aspect];
    expect(image).toHaveAttribute('width', String(dimensions.width));
    expect(image).toHaveAttribute('height', String(dimensions.height));
    expect(image).toHaveStyle({ objectFit: 'contain' });
  },
);

it('reports accessible failure and resets it for a new source', () => {
  const view = render(<MuiImage src="/missing.svg" alt="Workspace" />);
  const image = screen.getByRole('img', { name: 'Workspace' });
  fireEvent.error(image);
  const failure = screen.getByRole('img', { name: 'Workspace' });
  expect(failure.className).toContain('MuiPaper-root');
  expect(failure).toHaveTextContent(COLOR_MODE_POLICY.imageFallback);
  expect(failure).toHaveAccessibleDescription(COLOR_MODE_POLICY.imageFallback);
  expect(failure.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
  expect(failure).not.toHaveAttribute('src');
  expect(failure.parentElement).toHaveAttribute('aria-busy', 'false');
  expect(failure).not.toHaveStyle({ height: '100%' });
  expect(failure).toHaveStyle({ overflowWrap: 'anywhere' });
  expect(screen.getByText(COLOR_MODE_POLICY.imageFallback))
    .toHaveStyle({ overflowWrap: 'anywhere' });
  view.rerender(<MuiImage src="/recovered.svg" alt="Recovered workspace" />);
  const recovered = screen.getByRole('img', { name: 'Recovered workspace' });
  expect(recovered).toHaveAttribute('src', '/recovered.svg');
  expect(recovered.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
  fireEvent.load(recovered);
  expect(recovered.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
});

it('keeps the current loading source isolated from detached source events', () => {
  const view = render(<MuiImage src="/first.svg" alt="Workspace" />);
  const previous = screen.getByRole('img', { name: 'Workspace' });
  fireEvent.load(previous);
  view.rerender(<MuiImage src="/second.svg" alt="Workspace" />);
  const current = screen.getByRole('img', { name: 'Workspace' });
  expect(current).not.toBe(previous);
  fireEvent.error(previous);
  fireEvent.load(previous);
  expect(current).toHaveAttribute('src', '/second.svg');
  expect(current.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
  fireEvent.load(current);
  expect(current.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'false');
});
