import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PaginationExample, UrlPaginationExample } from './pagination.js';

it('moves between result pages', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PaginationExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  await user.click(screen.getByRole('button', { name: 'Previous page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
});

it('preserves the order filter and results anchor in page links', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <UrlPaginationExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
    'href',
    '/orders?status=open&page=2&pageSize=10#results',
  );
});
