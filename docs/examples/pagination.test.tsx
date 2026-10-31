import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PaginationExample, UrlPaginationExample } from './pagination.js';
describe('documented Pagination examples', () => {
  it('changes datasets, windows, page sizes and logical presentation', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PaginationExample />
      </ReacdProvider>,
    );
    const pager = within(
      screen.getByRole('navigation', { name: 'Sample result pages' }),
    );
    await user.click(pager.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Selected page: 2. Page size: 10.')).toBeInTheDocument();
    for (const [label, options] of [
      [
        'Pagination dataset',
        ['Billion-item count', '1000 items', 'Empty dataset', '23 items'],
      ],
      ['Pagination page size', ['25 per page', '100 per page', '10 per page']],
      ['Pagination size', ['Small', 'Large', 'Medium']],
      ['Pagination siblings', ['No siblings', 'One sibling', 'Two siblings']],
    ] as const)
      for (const option of options) {
        await chooseOption(user, label, option);
      }
    for (const label of [
      'Show pagination edges',
      'Show pagination controls',
      'Disable pagination',
      'Read-only pagination',
    ]) {
      await user.click(screen.getByRole('switch', { name: label }));
      await user.click(screen.getByRole('switch', { name: label }));
    }
    await user.click(pager.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Reset sample page' }));
    expect(pager.getByRole('status')).toHaveTextContent('Page 1 of 3');
  });
  it('compiles native URL paging against the same public contract', () => {
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
});
