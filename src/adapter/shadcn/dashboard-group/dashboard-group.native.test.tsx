import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import type { DashboardGroupProps } from '../../../components/dashboard-group/index.js';
import { ShadcnDashboardGroup } from './dashboard-group.adapter.js';
import { ShadcnDashboardSidebar } from
  '../dashboard-sidebar/dashboard-sidebar.adapter.js';
import { ShadcnDashboardPanel } from '../dashboard-panel/dashboard-panel.adapter.js';
import { ShadcnDashboardNavbar } from '../dashboard-navbar/dashboard-navbar.adapter.js';
import { ShadcnDashboardResizeHandle } from
  '../dashboard-resize-handle/dashboard-resize-handle.adapter.js';
import { DashboardContext, DashboardRegionContext } from './dashboard-context.js';

const value = [
  { id: 'nav', share: 30 },
  { id: 'work', share: 70 },
];
const base = {
  label: 'Workspace',
  value,
  onValueChange: vi.fn(),
  open: true,
  onOpenChange: vi.fn(),
  mobileOpen: false,
  onMobileOpenChange: vi.fn(),
};
afterEach(() => vi.restoreAllMocks());
function geometry() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 1200,
    height: 600,
    top: 0,
    left: 0,
    right: 1200,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1200);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
}
const regions: DashboardGroupProps['regions'] = [
  {
    id: 'nav',
    label: 'Navigation',
    kind: 'sidebar',
    content: (
      <ShadcnDashboardSidebar>
        <input aria-label="Navigation draft" />
        <ShadcnDashboardResizeHandle label="Resize navigation" />
      </ShadcnDashboardSidebar>
    ),
  },
  {
    id: 'work',
    label: 'Editor',
    kind: 'panel',
    content: (
      <ShadcnDashboardPanel>
        <ShadcnDashboardNavbar />
        Work
      </ShadcnDashboardPanel>
    ),
  },
];
it('maps scoped regions to one native SDK boundary', async () => {
  geometry();
  const view = render(
    <ShadcnDashboardGroup {...base} regions={regions}>
      Outside regions
    </ShadcnDashboardGroup>,
  );
  expect(screen.getByRole('main', { name: 'Editor' })).toHaveTextContent('Work');
  expect(screen.getByText('Outside regions')).toBeVisible();
  expect(screen.getAllByRole('separator')).toHaveLength(1);
  const handle = screen.getByRole('separator', { name: 'Resize navigation' });
  handle.focus();
  await userEvent.keyboard('{ArrowRight}');
  await waitFor(() =>
    expect(base.onValueChange).toHaveBeenCalledWith([
      { id: 'nav', share: 35 },
      { id: 'work', share: 65 },
    ]),
  );
  view.rerender(
    <ShadcnDashboardGroup
      {...base}
      regions={regions}
      open={false}
      collapseMode="icon"
      resizeLabel="Resize"
    />,
  );
  expect(screen.getByRole('separator')).toHaveAttribute('aria-disabled', 'true');
});
it('reports wrong/missing regions and ambiguous or final boundary declarations', () => {
  geometry();
  const view = render(
    <>
      <ShadcnDashboardSidebar />
      <ShadcnDashboardResizeHandle />
    </>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  view.rerender(
    <DashboardContext
      value={{
        properties: { ...base, regions },
        narrow: false,
        blocked: false,
      }}
    >
      <DashboardRegionContext value={{ id: 'work', label: 'Work', kind: 'panel' }}>
        <ShadcnDashboardSidebar />
      </DashboardRegionContext>
    </DashboardContext>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('requires a sidebar region');
  const duplicate: DashboardGroupProps['regions'] = [
    {
      id: 'nav',
      label: 'Navigation',
      kind: 'sidebar',
      content: (
        <>
          <ShadcnDashboardResizeHandle label="First" />
          <ShadcnDashboardResizeHandle label="Second" disabled />
        </>
      ),
    },
    {
      id: 'work',
      label: 'Work',
      kind: 'panel',
      content: <ShadcnDashboardResizeHandle />,
    },
  ];
  view.rerender(<ShadcnDashboardGroup {...base} regions={duplicate} />);
  expect(screen.getAllByRole('alert')).toHaveLength(3);
  expect(screen.getByRole('separator')).toHaveAttribute('aria-disabled', 'true');
  fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
  view.rerender(
    <ShadcnDashboardGroup
      {...base}
      regions={[
        { id: 'nav', label: 'Navigation', kind: 'sidebar' },
        { id: 'work', label: 'Work', kind: 'panel' },
      ]}
    />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

it('keeps distinct handle metadata for multiple adjacent boundaries', () => {
  geometry();
  const view = render(
    <ShadcnDashboardGroup
      {...base}
      value={[
        { id: 'nav', share: 20 },
        { id: 'work', share: 40 },
        { id: 'detail', share: 40 },
      ]}
      regions={[
        {
          id: 'nav',
          label: 'Navigation',
          kind: 'sidebar',
          content: <ShadcnDashboardResizeHandle label="Navigation size" />,
        },
        {
          id: 'work',
          label: 'Work',
          kind: 'panel',
          content: <ShadcnDashboardResizeHandle label="Editor size" disabled />,
        },
        { id: 'detail', label: 'Detail', kind: 'panel' },
      ]}
    />,
  );
  expect(screen.getByRole('separator', { name: 'Navigation size' })).toBeVisible();
  expect(screen.getByRole('separator', { name: 'Editor size' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  view.rerender(
    <ShadcnDashboardGroup
      {...base}
      value={[
        { id: 'nav', share: 20 },
        { id: 'work', share: 40 },
        { id: 'detail', share: 40 },
      ]}
      regions={[
        { id: 'nav', label: 'Navigation', kind: 'sidebar' },
        {
          id: 'work',
          label: 'Work',
          kind: 'panel',
          content: <ShadcnDashboardResizeHandle label="Editor size" disabled />,
        },
        { id: 'detail', label: 'Detail', kind: 'panel' },
      ]}
    />,
  );
  expect(screen.getByRole('separator', { name: 'Editor size' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  view.unmount();
});
