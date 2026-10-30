import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SplitViewExample } from './split-view.js';

it('runs the SplitView public example', () => {
  render(
    <ReacdProvider>
      <SplitViewExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('heading', { name: 'Project summary' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Project details' })).toBeVisible();
});
