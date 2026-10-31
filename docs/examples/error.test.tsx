import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ErrorExample } from './error.js';

it('renders the documented Error declaration', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ErrorExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Page unavailable')).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
