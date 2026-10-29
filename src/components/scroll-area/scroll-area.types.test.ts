import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ScrollArea } from './scroll-area.js';
import type { ScrollAreaProps } from './scroll-area.props.js';
it('exposes named closed ScrollArea properties', () => {
  expectTypeOf<Parameters<typeof ScrollArea>[0]>().toEqualTypeOf<ScrollAreaProps>();
  expectTypeOf<ReturnType<typeof ScrollArea>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onScroll', keyof ScrollAreaProps>
  >().toBeNever();
});
