import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DataTableExample } from './data-table.js';

it('runs the DataTable public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DataTableExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('checkbox', { name: 'Select row sample-a' }));
  expect(screen.getByText('Selected sample rows: sample-a')).toBeVisible();
  expect(
    screen.getByRole('table', { name: 'Selectable sample records' }),
  ).toBeVisible();
});
