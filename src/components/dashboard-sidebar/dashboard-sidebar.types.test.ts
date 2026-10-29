import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardSidebar } from './dashboard-sidebar.js';
import type { DashboardSidebarProps } from './dashboard-sidebar.props.js';

it('exposes named closed DashboardSidebar props', () => {
  expectTypeOf<
    Parameters<typeof DashboardSidebar>[0]
  >().toEqualTypeOf<DashboardSidebarProps>();
  expectTypeOf<ReturnType<typeof DashboardSidebar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardSidebarProps
    >
  >().toBeNever();
});
