import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { PageColumnsExample } from './page-columns.js';
import { userEvent } from '@testing-library/user-event';

it('renders the documented PageColumns declaration', () => {
  render(
    <ReacdProvider>
      <PageColumnsExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('preserves declaration identity when selecting flow content', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PageColumnsExample />
    </ReacdProvider>,
  );
  for (const item of [
    { key: 'first', title: 'First' },
    { key: 'sixth', title: 'Sixth' },
  ]) {
    await user.click(
      screen.getByRole('button', {
        name: `Inspect flow ${item.key}`,
      }),
    );
    expect(screen.getByText(`Selected flow: ${item.title}`)).toBeVisible();
  }
});
