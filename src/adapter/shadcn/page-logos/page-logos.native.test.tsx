import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageLogos } from './page-logos.adapter.js';
const items = [
  { key: 'one', src: '/one.svg', alt: 'First' },
  { key: 'two', src: '/two.svg', alt: 'Second' },
];
it('contains images, preserves keys and retries changed sources', () => {
  const view = render(<ShadcnPageLogos title="Artwork" label="Marks" items={items} />);
  expect(screen.getByRole('heading')).toHaveTextContent('Artwork');
  expect(screen.getByRole('list', { name: 'Marks' })).toBeVisible();
  const first = screen.getByRole('img', { name: 'First' });
  const second = screen.getByRole('img', { name: 'Second' });
  expect(first).toHaveAttribute('width', '160');
  expect(first.className).toContain('object-contain');
  fireEvent.error(first);
  expect(screen.getByRole('img', { name: 'First' })).toHaveTextContent(
    'Image unavailable:',
  );
  view.rerender(<ShadcnPageLogos label="Marks" items={[...items].reverse()} />);
  expect(screen.getByRole('img', { name: 'Second' })).toBe(second);
  view.rerender(
    <ShadcnPageLogos
      label="Marks"
      items={[{ key: 'one', src: '/replacement.svg', alt: 'First' }]}
    />,
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', '/replacement.svg');
});
it('provides a useful default or explicit empty state', () => {
  const view = render(<ShadcnPageLogos label="Marks" items={[]} />);
  expect(screen.getByText('No logos to display.')).toBeVisible();
  view.rerender(<ShadcnPageLogos label="Marks" items={[]} emptyLabel="No artwork" />);
  expect(screen.getByText('No artwork')).toBeVisible();
});
