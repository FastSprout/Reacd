import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ElementFoundationsExample } from './element-foundations.js';
it('runs the scoped direction control for every element example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ElementFoundationsExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left elements' }));
  await user.click(screen.getByRole('button', { name: 'Request export' }));
  expect(screen.getByText('Export requests: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Right to left elements' }));
});
