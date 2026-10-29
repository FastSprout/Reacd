import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardSidebarToggle } from './dashboard-sidebar-toggle.js';
import type { DashboardSidebarToggleProps } from './dashboard-sidebar-toggle.props.js';

it('exposes named closed DashboardSidebarToggle props', () => {
  expectTypeOf<
    Parameters<typeof DashboardSidebarToggle>[0]
  >().toEqualTypeOf<DashboardSidebarToggleProps>();
  expectTypeOf<ReturnType<typeof DashboardSidebarToggle>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardSidebarToggleProps
    >
  >().toBeNever();
});
