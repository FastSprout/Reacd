import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { InputRating, type InputRatingProps } from './input-rating.js';

it('exposes closed numeric rating props and an explicit ReactNode return', () => {
  expectTypeOf<Parameters<typeof InputRating>[0]>().toEqualTypeOf<InputRatingProps>();
  expectTypeOf<ReturnType<typeof InputRating>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<InputRatingProps['onValueChange']>>().toEqualTypeOf<
    [number]
  >();
  expectTypeOf<InputRatingProps['step']>().toEqualTypeOf<1 | 0.5 | undefined>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onChange', keyof InputRatingProps>
  >().toBeNever();
});
