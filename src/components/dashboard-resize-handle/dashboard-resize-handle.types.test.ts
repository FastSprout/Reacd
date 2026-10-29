import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { DashboardResizeHandle } from './dashboard-resize-handle.js';
import type { DashboardResizeHandleProps } from './dashboard-resize-handle.props.js';

it('exposes named closed DashboardResizeHandle props', () => {
  expectTypeOf<
    Parameters<typeof DashboardResizeHandle>[0]
  >().toEqualTypeOf<DashboardResizeHandleProps>();
  expectTypeOf<ReturnType<typeof DashboardResizeHandle>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'onClick',
      keyof DashboardResizeHandleProps
    >
  >().toBeNever();
});
