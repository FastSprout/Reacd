import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';
import {
  ReacdProvider,
  DashboardGroup,
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardResizeHandle,
  Input,
  Text,
} from '../../../index.js';
import type { DashboardGroupProps } from '../../../components/dashboard-group/index.js';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

function Scene() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [value, setValue] = useState<DashboardGroupProps['value']>([
    { id: 'navigation', share: 25 },
    { id: 'inbox', share: 75 },
  ]);
  const [query, setQuery] = useState('Retained query');
  return (
    <ReacdProvider adapter={shadcnAdapter}>
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
            content: (
              <DashboardSidebar collapsedContent={<Text>Workspace</Text>}>
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
                    <Text>Actions</Text>
                    <DashboardResizeHandle />
                  </DashboardToolbar>
                }
              >
                <Text>Inbox body</Text>
              </DashboardPanel>
            ),
          },
        ]}
      />
    </ReacdProvider>
  );
}

it('uses wide group scope, controlled collapse and retained query state', async () => {
  const user = userEvent.setup();
  render(<Scene />);
  expect(
    screen.getByRole('complementary', { name: 'Workspace navigation' }),
  ).toBeVisible();
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('main', { name: 'Inbox' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
  expect(screen.queryByRole('complementary')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Expand navigation' }));
  expect(screen.getByRole('textbox', { name: 'Navigation query' })).toHaveValue(
    'Retained query',
  );
  const handle = screen.getByRole('separator', { name: 'Workspace navigation' });
  fireEvent.keyDown(handle, { key: 'ArrowRight' });
  expect(handle).toHaveAttribute('aria-valuenow', '26');
  resizeContainers(320);
  expect(screen.queryByRole('dialog')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(screen.getByRole('dialog', { name: 'Workspace navigation' })).toBeVisible();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
});
