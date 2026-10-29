import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardSearch } from './dashboard-search.js';
import type { DashboardSearchProps } from './dashboard-search.props.js';

it('exposes named closed DashboardSearch props', () => {
  expectTypeOf<
    Parameters<typeof DashboardSearch>[0]
  >().toEqualTypeOf<DashboardSearchProps>();
  expectTypeOf<ReturnType<typeof DashboardSearch>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardSearchProps
    >
  >().toBeNever();
});
