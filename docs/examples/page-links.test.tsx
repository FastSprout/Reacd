import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { PageLinksExample } from './page-links.js';

it('runs the closed PageLinks documentation example', () => {
  render(
    <ReacdProvider>
      <PageLinksExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
