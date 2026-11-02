import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnIcon } from './icon.adapter.js';

it('uses the SDK icon set with explicit accessible or decorative intent', () => {
  const view = render(<ShadcnIcon name="search" label="Search" />);
  expect(screen.getByRole('img', { name: 'Search' }).tagName).toBe('svg');
  view.rerender(<ShadcnIcon name="check" decorative size="large" />);
  expect(screen.queryByRole('img')).toBeNull();
  view.rerender(<ShadcnIcon name="loading" label="Loading" />);
  expect(screen.getByRole('img', { name: 'Loading' }).classList).toContain(
    'animate-spin',
  );
});
