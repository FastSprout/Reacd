import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  App,
  DashboardGroup,
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  Input,
  Text,
} from '../src/index.js';
import type { DashboardGroupProps } from '../src/components/dashboard-group/index.js';

export function DashboardScene({
  properties = {},
  sidebar,
  content,
  rtl = false,
}: {
  properties?: Partial<DashboardGroupProps>;
  sidebar?: ReactNode;
  content?: ReactNode;
  rtl?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [value, setValue] = useState<DashboardGroupProps['value']>([
    { id: 'navigation', share: 25 },
    { id: 'inbox', share: 75 },
  ]);
  const [query, setQuery] = useState('Retained query');
  return (
    <App direction={rtl ? 'rtl' : 'ltr'}>
      <DashboardGroup
        label="Workspace"
        open={open}
        onOpenChange={setOpen}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        value={value}
        onValueChange={setValue}
        regions={[
          {
            id: 'navigation',
            label: 'Workspace navigation',
            kind: 'sidebar',
            content: sidebar ?? (
              <DashboardSidebar>
                <Input
                  label="Navigation query"
                  value={query}
                  onValueChange={setQuery}
                />
              </DashboardSidebar>
            ),
          },
          {
            id: 'inbox',
            label: 'Inbox',
            kind: 'panel',
            content: (
              <DashboardPanel
                header={<DashboardNavbar leading={<DashboardSidebarCollapse />} />}
                footer={
                  <DashboardToolbar label="Inbox actions">
                    <DashboardSidebarToggle label="Extra mobile toggle" />
                  </DashboardToolbar>
                }
              >
                {content ?? <Text>Inbox body</Text>}
              </DashboardPanel>
            ),
          },
        ]}
        {...properties}
      >
        <Text>{`Desktop open: ${String(open)}`}</Text>
        <Text>{`Mobile open: ${String(mobileOpen)}`}</Text>
        <Text>{`Panel shares: ${value.map((panel) => panel.share).join(',')}`}</Text>
      </DashboardGroup>
    </App>
  );
}
