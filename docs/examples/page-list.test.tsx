import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageListExample } from './page-list.js';
import { userEvent } from '@testing-library/user-event';

it('renders the documented PageList declaration', () => {
  render(
    <ReacdProvider>
      <PageListExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('preserves field state when list boundaries change', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PageListExample />
    </ReacdProvider>,
  );
  const query = screen.getByLabelText('Page list query');
  await user.type(query, 'Retained list query');
  await user.click(screen.getByRole('switch', { name: 'Divide page list' }));
  expect(screen.getByRole('list')).toHaveAttribute('data-divide', 'true');
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(query).toHaveValue('Retained list query');
});
