import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageGridExample } from './page-grid.js';
import { userEvent } from '@testing-library/user-event';

it('renders the documented PageGrid declaration', () => {
  render(
    <ReacdProvider>
      <PageGridExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('preserves declaration identity when selecting grid content', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PageGridExample />
    </ReacdProvider>,
  );
  for (const item of [
    { key: 'first', title: 'First' },
    { key: 'sixth', title: 'Sixth' },
  ]) {
    await user.click(
      screen.getByRole('button', {
        name: `Inspect grid ${item.key}`,
      }),
    );
    expect(screen.getByText(`Selected grid: ${item.title}`)).toBeVisible();
  }
});
