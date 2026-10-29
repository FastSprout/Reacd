import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardSidebarCollapse } from './dashboard-sidebar-collapse.js';
import type { DashboardSidebarCollapseProps } from
  './dashboard-sidebar-collapse.props.js';

it('exposes named closed DashboardSidebarCollapse props', () => {
  expectTypeOf<
    Parameters<typeof DashboardSidebarCollapse>[0]
  >().toEqualTypeOf<DashboardSidebarCollapseProps>();
  expectTypeOf<
    ReturnType<typeof DashboardSidebarCollapse>
  >().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardSidebarCollapseProps
    >
  >().toBeNever();
});
