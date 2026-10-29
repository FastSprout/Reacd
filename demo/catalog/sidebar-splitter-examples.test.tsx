import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { SidebarSplitterExamples } from './sidebar-splitter-examples.js';
import { installLayout } from '../../test-support/layout-observer.js';

it('mounts both runnable layout examples in a named reference section', () => {
  const restore = installLayout();
  const view = render(
    <ReacdProvider>
      <SidebarSplitterExamples />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Sidebar and Splitter' })).toBeVisible();
  expect(
    screen.getByRole('complementary', { name: 'Workspace navigation' }),
  ).toBeVisible();
  expect(screen.getByRole('group', { name: 'Document workspace' })).toBeVisible();
  view.unmount();
  restore();
});
