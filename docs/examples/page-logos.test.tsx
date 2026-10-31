import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageLogosExample } from './page-logos.js';

it('reverses honest keyed placeholders', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageLogosExample />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('img')[0]).toHaveAttribute(
    'alt',
    'First image placeholder',
  );
  await user.click(screen.getByRole('button', { name: 'Reverse example marks' }));
  expect(screen.getAllByRole('img')[0]).toHaveAttribute(
    'alt',
    'Second image placeholder',
  );
});
