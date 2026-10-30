import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageSectionExample } from './page-section.js';

it('renders the runnable PageSection reference', () => {
  render(
    <ReacdProvider>
      <PageSectionExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
});
