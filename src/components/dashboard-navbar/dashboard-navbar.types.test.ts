import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardNavbar } from './dashboard-navbar.js';
import type { DashboardNavbarProps } from './dashboard-navbar.props.js';

it('exposes named closed DashboardNavbar props', () => {
  expectTypeOf<
    Parameters<typeof DashboardNavbar>[0]
  >().toEqualTypeOf<DashboardNavbarProps>();
  expectTypeOf<ReturnType<typeof DashboardNavbar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardNavbarProps
    >
  >().toBeNever();
});
