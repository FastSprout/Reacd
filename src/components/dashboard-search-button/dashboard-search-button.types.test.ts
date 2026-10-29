import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardSearchButton } from './dashboard-search-button.js';
import type { DashboardSearchButtonProps } from './dashboard-search-button.props.js';

it('exposes named closed DashboardSearchButton props', () => {
  expectTypeOf<
    Parameters<typeof DashboardSearchButton>[0]
  >().toEqualTypeOf<DashboardSearchButtonProps>();
  expectTypeOf<ReturnType<typeof DashboardSearchButton>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardSearchButtonProps
    >
  >().toBeNever();
});
