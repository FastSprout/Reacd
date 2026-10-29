import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ColorModeImage, type ColorModeImageProps } from './index.js';

it('exposes named closed ColorModeImage properties', () => {
  expectTypeOf<Parameters<typeof ColorModeImage>[0]>().toEqualTypeOf<
    ColorModeImageProps
  >();
  expectTypeOf<ReturnType<typeof ColorModeImage>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as', keyof ColorModeImageProps>>()
    .toBeNever();
});
