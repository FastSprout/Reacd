import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { PageAsideExample } from './page-aside.js';

it('renders the documented PageAside declaration', () => {
  render(
    <ReacdProvider>
      <PageAsideExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Return to page overview' })).toHaveAttribute(
    'href',
    '/',
  );
});
