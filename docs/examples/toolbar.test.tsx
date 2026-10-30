import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ToolbarExample } from './toolbar.js';

it('runs the Toolbar public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ToolbarExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('group', { name: 'Draft actions' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Save toolbar draft' }));
  expect(screen.getByText('Toolbar saves: 1')).toBeVisible();
});
