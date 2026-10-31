import type { ReactNode } from 'react';
import {
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
  Text,
} from '../../src/index.js';

function frame(content: ReactNode, sidebar: ReactNode = <DashboardSidebar />) {
  return (
    <DashboardGroup
      label="Dashboard example"
      open
      onOpenChange={() => undefined}
      mobileOpen={false}
      onMobileOpenChange={() => undefined}
      onValueChange={() => undefined}
      value={[
        { id: 'navigation', share: 25 },
        { id: 'content', share: 75 },
      ]}
      regions={[
        { id: 'navigation', label: 'Navigation', kind: 'sidebar', content: sidebar },
        {
          id: 'content',
          label: 'Content',
          kind: 'panel',
          content: <DashboardPanel>{content}</DashboardPanel>,
        },
      ]}
    />
  );
}

export const DASHBOARD_EXAMPLES = {
  DashboardGroup: frame(<Text>Group content</Text>),
  DashboardSidebar: frame(
    <Text>Panel</Text>,
    <DashboardSidebar>
      <Text>Navigation content</Text>
    </DashboardSidebar>,
  ),
  DashboardPanel: frame(
    <DashboardPanel label="Nested panel">
      <Text>Panel</Text>
    </DashboardPanel>,
  ),
  DashboardNavbar: frame(<DashboardNavbar title="Inbox" />),
  DashboardToolbar: frame(
    <DashboardToolbar label="Inbox actions">
      <Text>Actions</Text>
    </DashboardToolbar>,
  ),
  DashboardSidebarCollapse: frame(<DashboardSidebarCollapse />),
  DashboardSidebarToggle: frame(<DashboardSidebarToggle />),
  DashboardResizeHandle: frame(
    <Text>Panel</Text>,
    <DashboardSidebar>
      <DashboardResizeHandle label="Navigation resize" />
    </DashboardSidebar>,
  ),
  DashboardSearch: (
    <DashboardSearch
      label="Find dashboard content"
      groups={[]}
      query=""
      onQueryChange={() => undefined}
      open={false}
      onOpenChange={() => undefined}
    />
  ),
  DashboardSearchButton: <DashboardSearchButton onPress={() => undefined} />,
};
