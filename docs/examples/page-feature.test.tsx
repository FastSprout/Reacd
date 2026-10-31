import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageFeatureExample } from './page-feature.js';

it('renders the runnable PageFeature reference', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageFeatureExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
});
