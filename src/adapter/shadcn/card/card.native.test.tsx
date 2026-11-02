import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnCard } from './card.adapter.js';

it('composes official card header, content and footer', () => {
  const view = render(
    <ShadcnCard label="Profile" spacing="small" header="Customer" footer="Updated">
      Details
    </ShadcnCard>,
  );
  const card = screen.getByRole('region', { name: 'Profile' });
  expect(card.className).toContain('bg-card');
  expect(screen.getByText('Customer').className).toContain('p-6');
  expect(screen.getByText('Details').className).toContain('gap-2');
  expect(screen.getByText('Details').className).toContain('grid-cols-1');
  expect(screen.getByText('Updated')).toBeVisible();
  view.rerender(<ShadcnCard>Details</ShadcnCard>);
  expect(screen.queryByText('Customer')).toBeNull();
  expect(screen.queryByRole('region')).toBeNull();
});
