import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  DashboardGroup,
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  DashboardResizeHandle,
  Page,
  Text,
  ReacdProvider,
} from '../../../index.js';
import { DashboardScene } from '../../../../test-support/dashboard-scene.js';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

it('reports missing or incompatible context instead of inventing local state', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardSidebar />
      <DashboardSidebarCollapse />
      <DashboardSidebarToggle />
      <DashboardResizeHandle />
      <DashboardPanel />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(5);
});

it('renders complete standalone presentation slots and scoped main semantics', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardPanel
        label="Standalone"
        header={
          <DashboardNavbar
            start={<Text>Start</Text>}
            end={<Text>End</Text>}
            leading={<Text>Leading</Text>}
            trailing={<Text>Trailing</Text>}
          >
            <Text>Navbar middle</Text>
          </DashboardNavbar>
        }
        footer={
          <DashboardToolbar
            label="Actions"
            start={<Text>Toolbar start</Text>}
            end={<Text>Toolbar end</Text>}
          >
            <Text>Toolbar middle</Text>
          </DashboardToolbar>
        }
      >
        <Text>Panel body</Text>
      </DashboardPanel>
    </ReacdProvider>,
  );
  expect(screen.getByRole('main', { name: 'Standalone' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  for (const text of [
    'Start',
    'End',
    'Leading',
    'Trailing',
    'Navbar middle',
    'Toolbar start',
    'Toolbar end',
    'Toolbar middle',
    'Panel body',
  ])
    expect(screen.getByText(text)).toBeVisible();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Page title="Application">
        <DashboardPanel label="Nested">
          <DashboardNavbar title="Nested title" />
          <DashboardPanel label="Inner panel" />
        </DashboardPanel>
      </Page>
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('region', { name: 'Nested' })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Inner panel' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Nested title', level: 2 })).toBeVisible();
});

it('assigns only the first content panel a main landmark', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardGroup
        label="Many panes"
        open
        onOpenChange={() => undefined}
        mobileOpen={false}
        onMobileOpenChange={() => undefined}
        onValueChange={() => undefined}
        value={[
          { id: 'navigation', share: 20 },
          { id: 'first', share: 40 },
          { id: 'second', share: 40 },
        ]}
        regions={[
          {
            id: 'navigation',
            label: 'Navigation',
            kind: 'sidebar',
            content: <DashboardSidebar />,
          },
          { id: 'first', label: 'First', kind: 'panel', content: <DashboardPanel /> },
          { id: 'second', label: 'Second', kind: 'panel', content: <DashboardPanel /> },
        ]}
      />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('main', { name: 'First' })).toBeVisible();
  expect(screen.getByRole('region', { name: 'Second' })).toBeVisible();
});

it('supports icon collapse and honors disabled or rejected changes', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardScene
        properties={{ collapseMode: 'icon' }}
        sidebar={
          <DashboardSidebar
            description="Navigation description"
            header={<Text>Header</Text>}
            footer={<Text>Footer</Text>}
            actions={<Text>Actions</Text>}
            collapsedContent={<Text>Compact navigation</Text>}
          />
        }
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
  expect(screen.getByText('Compact navigation')).toBeVisible();
  expect(screen.getByText('Panel shares: 25,75')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Expand navigation' }));
  expect(screen.getByText('Header')).toBeVisible();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardScene properties={{ onOpenChange: change, onValueChange: change }} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
  expect(change).toHaveBeenCalledWith(false);
  const handle = screen.getByRole('separator');
  fireEvent.keyDown(handle, { key: 'End' });
  expect(handle).toHaveAttribute('aria-valuenow', '25');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardScene properties={{ disabled: true }} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('button', { name: 'Collapse navigation' })).toBeDisabled();
  fireEvent.keyDown(handle, { key: 'ArrowRight' });
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1 });
  expect(handle).toHaveAttribute('aria-disabled', 'true');
});

it('scopes custom controls and restores mobile focus', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DashboardScene
        rtl
        content={<DashboardSidebarCollapse label="Custom collapse" disabled />}
      />
    </ReacdProvider>,
  );
  const handle = screen.getByRole('separator');
  handle.focus();
  fireEvent.keyDown(handle, { key: 'ArrowRight' });
  expect(handle).toHaveAttribute('aria-valuenow', '24');
  fireEvent.keyDown(handle, { key: 'Tab' });
  fireEvent.pointerDown(handle, { pointerId: 1, button: 0, clientX: 100 });
  fireEvent.pointerMove(handle, { pointerId: 1, clientX: 200 });
  fireEvent.pointerCancel(handle, { pointerId: 1 });
  expect(handle).toHaveAttribute('aria-valuenow', '24');
  expect(screen.getByRole('button', { name: 'Custom collapse' })).toBeDisabled();
  resizeContainers(320);
  const toggle = screen.getByRole('button', { name: 'Extra mobile toggle' });
  await user.click(toggle);
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  await waitFor(() => expect(toggle).toHaveFocus());
});
