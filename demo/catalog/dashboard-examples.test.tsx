import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { DashboardExamples } from './dashboard-examples.js';
import { installLayout } from '../../test-support/layout-observer.js';

it('mounts the runnable dashboard in its own named reference section', () => {
  const restore = installLayout();
  const view = render(
    <ReacdProvider>
      <DashboardExamples />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Dashboard components' })).toBeVisible();
  expect(screen.getByRole('group', { name: 'Dashboard workspace' })).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
  view.unmount();
  restore();
});
