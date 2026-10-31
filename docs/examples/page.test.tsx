import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageExample } from './page.js';

it('runs the closed Page documentation example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
