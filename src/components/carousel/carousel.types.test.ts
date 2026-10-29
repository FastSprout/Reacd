import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Carousel, type CarouselProps, type CarouselItem } from './index.js';
it('exposes closed controlled indexes and validated component children', () => {
  expectTypeOf<Parameters<typeof Carousel>[0]>().toEqualTypeOf<CarouselProps>();
  expectTypeOf<ReturnType<typeof Carousel>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<CarouselProps['onValueChange']>>().toEqualTypeOf<[number]>();
  expectTypeOf<CarouselItem['children']>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onKeyDown' | 'render', keyof CarouselProps>
  >().toBeNever();
});
