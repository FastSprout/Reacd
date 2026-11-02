import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { HeadingLevelContext } from '../../../renderer/heading/heading-context.js';
import { DashboardContext, DashboardRegionContext } from './dashboard-context.js';
import { ShadcnDashboardNavbar } from '../dashboard-navbar/dashboard-navbar.adapter.js';
import { ShadcnDashboardSidebarCollapse } from
  '../dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { ShadcnDashboardSidebarToggle } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';

const open = vi.fn();
const mobile = vi.fn();
const properties = {
  label: 'Workspace',
  regions: [],
  value: [],
  onValueChange: vi.fn(),
  open: true,
  onOpenChange: open,
  mobileOpen: false,
  onMobileOpenChange: mobile,
};
it('keeps desktop and mobile callbacks independent', async () => {
  const view = render(
    <DashboardContext
      value={{
        properties,
        narrow: false,
        blocked: false,
      }}
    >
      <ShadcnDashboardSidebarCollapse />
      <ShadcnDashboardSidebarToggle />
    </DashboardContext>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
  expect(open).toHaveBeenCalledExactlyOnceWith(false);
  expect(mobile).not.toHaveBeenCalled();
  view.rerender(
    <DashboardContext
      value={{
        properties: { ...properties, open: false },
        narrow: false,
        blocked: false,
      }}
    >
      <ShadcnDashboardSidebarCollapse />
    </DashboardContext>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Expand navigation' }));
  expect(open).toHaveBeenLastCalledWith(true);
  view.rerender(
    <DashboardContext value={{ properties, narrow: true, blocked: false }}>
      <ShadcnDashboardSidebarToggle />
      <ShadcnDashboardSidebarCollapse />
    </DashboardContext>,
  );
  const trigger = screen.getByRole('button', { name: 'Open navigation' });
  await userEvent.click(trigger);
  expect(trigger).toHaveFocus();
  expect(mobile).toHaveBeenCalledExactlyOnceWith(true);
  view.rerender(
    <DashboardContext value={{ properties, narrow: true, blocked: true }}>
      <ShadcnDashboardSidebarToggle label="Open" />
    </DashboardContext>,
  );
  expect(screen.getByRole('button', { name: 'Open' })).toBeDisabled();
});
it('reports controls missing group metadata, instead of an imitation control', () => {
  render(
    <>
      <ShadcnDashboardSidebarCollapse />
      <ShadcnDashboardSidebarToggle />
    </>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('button')).toBeNull();
});
it('keeps all navbar slots and bounded native typography with no banner', () => {
  const view = render(
    <ShadcnDashboardNavbar
      leading="Leading"
      start="Start"
      end="End"
      trailing="Trailing"
    >
      Body
    </ShadcnDashboardNavbar>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  expect(view.container).toHaveTextContent('LeadingStartDashboardBodyEndTrailing');
  expect(screen.queryByRole('banner')).toBeNull();
  view.rerender(
    <HeadingLevelContext value={6}>
      <DashboardRegionContext value={{ id: 'x', label: 'Region', kind: 'panel' }}>
        <ShadcnDashboardNavbar />
      </DashboardRegionContext>
    </HeadingLevelContext>,
  );
  expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('Region');
  view.rerender(
    <DashboardContext value={{ properties, narrow: false, blocked: false }}>
      <ShadcnDashboardNavbar title="Explicit" />
    </DashboardContext>,
  );
  expect(screen.getByRole('heading')).toHaveTextContent('Explicit');
});
