import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSkeleton } from './skeleton.adapter.js';

it('composes SDK skeletons with bounded declared shape and visibility', () => {
  const view = render(<ShadcnSkeleton label="Loading orders" />);
  expect(screen.getByRole('status', { name: 'Loading orders' })).toBeVisible();
  expect(view.container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3);
  view.rerender(<ShadcnSkeleton animated={false} />);
  expect(view.container.querySelector('[data-slot="skeleton"]')?.className)
    .toContain('animate-none');
  view.rerender(<ShadcnSkeleton shape="avatar" animated={false} />);
  expect(view.container.querySelector('[data-slot="skeleton"]')?.className)
    .toContain('rounded-full');
  view.rerender(<ShadcnSkeleton shape="rectangle" size="large" />);
  expect(view.container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
  view.rerender(<ShadcnSkeleton show={false} />);
  expect(view.container.childNodes).toHaveLength(0);
});
