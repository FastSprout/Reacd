import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { PageHeaderExample } from './page-header.js';

it('renders the runnable PageHeader reference', () => {
  render(
    <ReacdProvider>
      <PageHeaderExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
});
