import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageAnchorsExample } from './page-anchors.js';

it('runs the closed PageAnchors documentation example', () => {
  render(
    <ReacdProvider>
      <PageAnchorsExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
