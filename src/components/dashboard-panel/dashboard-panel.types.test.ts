import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardPanel } from './dashboard-panel.js';
import type { DashboardPanelProps } from './dashboard-panel.props.js';

it('exposes named closed DashboardPanel props', () => {
  expectTypeOf<
    Parameters<typeof DashboardPanel>[0]
  >().toEqualTypeOf<DashboardPanelProps>();
  expectTypeOf<ReturnType<typeof DashboardPanel>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardPanelProps
    >
  >().toBeNever();
});
