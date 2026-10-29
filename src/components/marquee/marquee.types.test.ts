import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Marquee, type MarqueeProps } from './index.js';
it('exposes closed text-only items and a boolean host transition', () => {
  expectTypeOf<Parameters<typeof Marquee>[0]>().toEqualTypeOf<MarqueeProps>();
  expectTypeOf<ReturnType<typeof Marquee>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<MarqueeProps['onPausedChange']>>().toEqualTypeOf<[boolean]>();
  expectTypeOf<
    Extract<'children' | 'style' | 'className' | 'duration', keyof MarqueeProps>
  >().toBeNever();
});
