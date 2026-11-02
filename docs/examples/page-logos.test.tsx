import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageLogosExample } from './page-logos.js';

it('reverses keyed local artwork', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageLogosExample />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('img')[0]).toHaveAttribute(
    'alt',
    'Light appearance artwork',
  );
  await user.click(screen.getByRole('button', { name: 'Reverse example marks' }));
  expect(screen.getAllByRole('img')[0]).toHaveAttribute(
    'alt',
    'Dark appearance artwork',
  );
});
