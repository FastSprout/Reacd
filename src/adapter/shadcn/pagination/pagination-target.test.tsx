import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPaginationTarget } from './pagination-target.js';

it('renders callback-free links using browser navigation without cancellation', () => {
  render(
    <ShadcnPaginationTarget
      index={1}
      label="Next page"
      blocked={false}
      props={{
        label: 'Orders',
        totalItems: 30,
        value: { pageIndex: 0, pageSize: 10 },
        navigation: { href: '/orders' },
      }}
    >
      Next
    </ShadcnPaginationTarget>,
  );
  const link = screen.getByRole('link', { name: 'Next page' });
  let cancelled = true;
  link.addEventListener('click', (event) => {
    cancelled = event.defaultPrevented;
    event.preventDefault();
  });
  fireEvent.click(link);
  expect(cancelled).toBe(false);
  expect(link).toHaveAttribute('href', '/orders?page=2&pageSize=10');
});
