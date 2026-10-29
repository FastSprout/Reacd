import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ViewportExample } from './viewport.js';

it('runs the Viewport public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ViewportExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Constrain sample viewport' }));
  expect(screen.getByText('Viewport mode: compact')).toBeVisible();
  expect(screen.getByText('Viewport content remains available.')).toBeVisible();
});
