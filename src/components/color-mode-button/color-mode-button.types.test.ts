import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ColorModeButton, type ColorModeButtonProps } from './index.js';

it('exposes named closed ColorModeButton properties', () => {
  expectTypeOf<Parameters<typeof ColorModeButton>[0]>().toEqualTypeOf<
    ColorModeButtonProps
  >();
  expectTypeOf<ReturnType<typeof ColorModeButton>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as', keyof ColorModeButtonProps>>()
    .toBeNever();
  expectTypeOf<Parameters<ColorModeButtonProps['onValueChange']>>().toEqualTypeOf<
    ['light' | 'dark' | 'system']
  >();
});
