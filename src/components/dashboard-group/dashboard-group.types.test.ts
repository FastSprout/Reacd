import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardGroup } from './dashboard-group.js';
import type { DashboardGroupProps } from './dashboard-group.props.js';

it('exposes named closed DashboardGroup props', () => {
  expectTypeOf<
    Parameters<typeof DashboardGroup>[0]
  >().toEqualTypeOf<DashboardGroupProps>();
  expectTypeOf<ReturnType<typeof DashboardGroup>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardGroupProps
    >
  >().toBeNever();
});
