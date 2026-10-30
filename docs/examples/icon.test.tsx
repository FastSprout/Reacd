import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { IconExample } from './icon.js';
it('runs documented icon alternatives and logical sizing', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <IconExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Search workspace' })).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Large icon' }));
  await user.click(screen.getByRole('switch', { name: 'Decorative icon' }));
  expect(screen.queryByRole('img')).toBeNull();
  await user.click(screen.getByRole('switch', { name: 'Large icon' }));
});
