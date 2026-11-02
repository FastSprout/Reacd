import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { EmptyExample } from './empty.js';

it('replaces the empty state after creating the first project', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <EmptyExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('No projects yet')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Create project' }));
  expect(screen.getByText('Website redesign')).toBeVisible();
  expect(screen.queryByText('No projects yet')).toBeNull();
});
