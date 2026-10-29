import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ColorModeSelect, type ColorModeSelectProps } from './index.js';

it('exposes named closed ColorModeSelect properties', () => {
  expectTypeOf<Parameters<typeof ColorModeSelect>[0]>().toEqualTypeOf<
    ColorModeSelectProps
  >();
  expectTypeOf<ReturnType<typeof ColorModeSelect>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as', keyof ColorModeSelectProps>>()
    .toBeNever();
  expectTypeOf<Parameters<ColorModeSelectProps['onValueChange']>>().toEqualTypeOf<
    ['light' | 'dark' | 'system']
  >();
});
