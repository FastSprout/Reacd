import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import {
  defineThemeAdapter,
  ReacdProvider,
  DashboardGroup,
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  DashboardResizeHandle,
  DashboardSearch,
  DashboardSearchButton,
  Sidebar,
  Splitter,
  Text,
} from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativeDashboardEntries } from './native-dashboard.js';

const adapter = defineThemeAdapter({
  ...shadcnAdapter,
  components: { ...shadcnAdapter.components, ...nativeDashboardEntries },
});
it('maps the full closed dashboard family to scoped selected SDK compositions', () => {
  render(
    <ReacdProvider adapter={adapter}>
      <DashboardGroup
        label="Workspace"
        value={[
          { id: 'nav', share: 30 },
          { id: 'work', share: 70 },
        ]}
        onValueChange={vi.fn()}
        open
        onOpenChange={vi.fn()}
        mobileOpen={false}
        onMobileOpenChange={vi.fn()}
        regions={[
          {
            id: 'nav',
            label: 'Navigation',
            kind: 'sidebar',
            content: (
              <DashboardSidebar>
                <DashboardResizeHandle />
              </DashboardSidebar>
            ),
          },
          {
            id: 'work',
            label: 'Work',
            kind: 'panel',
            content: (
              <DashboardPanel>
                <DashboardNavbar leading={<DashboardSidebarCollapse />}>
                  <DashboardSidebarToggle />
                </DashboardNavbar>
                <DashboardToolbar label="Actions">
                  <Text>Declared</Text>
                </DashboardToolbar>
                <DashboardSearchButton onPress={vi.fn()} />
              </DashboardPanel>
            ),
          },
        ]}
      >
        <DashboardSearch
          label="Search"
          query=""
          onQueryChange={vi.fn()}
          open={false}
          onOpenChange={vi.fn()}
          groups={[]}
        />
      </DashboardGroup>
    </ReacdProvider>,
  );
  expect(screen.getByText('Declared')).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});
it('maps closed Sidebar and Splitter values without exposing SDK props', () => {
  render(
    <ReacdProvider adapter={adapter}>
      <Sidebar
        title="Navigation"
        open
        onOpenChange={vi.fn()}
        mobileOpen={false}
        onMobileOpenChange={vi.fn()}
        collapsible="none"
      >
        <Text>Sidebar</Text>
      </Sidebar>
      <Splitter
        label="Panels"
        panels={[
          { id: 'one', label: 'First', content: <Text>First</Text> },
          { id: 'two', label: 'Second', content: <Text>Second</Text> },
        ]}
        value={[
          { id: 'one', share: 50 },
          { id: 'two', share: 50 },
        ]}
        onValueChange={vi.fn()}
      />
    </ReacdProvider>,
  );
  expect(screen.getByText('Sidebar')).toBeVisible();
  expect(screen.getByRole('region', { name: 'First' })).toHaveTextContent('First');
});
