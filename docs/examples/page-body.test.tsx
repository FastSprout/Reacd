import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageBodyExample } from './page-body.js';
import { userEvent } from '@testing-library/user-event';

it('renders the documented PageBody declaration', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageBodyExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('stores field changes in the isolated application store', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageBodyExample />
    </ReacdProvider>,
  );
  const query = screen.getByLabelText('Page body query');
  await user.type(query, 'Retained body query');
  expect(query).toHaveValue('Retained body query');
});
