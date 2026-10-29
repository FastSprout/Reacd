import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Timeline } from './timeline.js';
import type { TimelineProps } from './timeline.props.js';
it('exposes named closed Timeline properties', () => {
  expectTypeOf<Parameters<typeof Timeline>[0]>().toEqualTypeOf<TimelineProps>();
  expectTypeOf<ReturnType<typeof Timeline>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof TimelineProps>
  >().toBeNever();
});
