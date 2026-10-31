import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageLinksExample } from './page-links.js';

it('runs the closed PageLinks documentation example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageLinksExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
