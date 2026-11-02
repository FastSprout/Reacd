import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { QuickStartExample } from './quick-start.js';

it('runs the complete short example shown in the home code panel', async () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <QuickStartExample />
    </ReacdProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Count: 0' }));
  expect(screen.getByRole('button', { name: 'Count: 1' })).toBeVisible();
});
