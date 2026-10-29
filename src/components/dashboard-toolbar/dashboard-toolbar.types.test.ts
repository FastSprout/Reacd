import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardToolbar } from './dashboard-toolbar.js';
import type { DashboardToolbarProps } from './dashboard-toolbar.props.js';

it('exposes named closed DashboardToolbar props', () => {
  expectTypeOf<
    Parameters<typeof DashboardToolbar>[0]
  >().toEqualTypeOf<DashboardToolbarProps>();
  expectTypeOf<ReturnType<typeof DashboardToolbar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardToolbarProps
    >
  >().toBeNever();
});
