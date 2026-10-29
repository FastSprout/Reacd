import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { PageCTAExample } from './page-cta.js';

it('runs the closed PageCTA documentation example', () => {
  render(
    <ReacdProvider>
      <PageCTAExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
