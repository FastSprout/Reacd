import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ColorModeSwitch, type ColorModeSwitchProps } from './index.js';

it('exposes named closed ColorModeSwitch properties', () => {
  expectTypeOf<Parameters<typeof ColorModeSwitch>[0]>().toEqualTypeOf<
    ColorModeSwitchProps
  >();
  expectTypeOf<ReturnType<typeof ColorModeSwitch>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as', keyof ColorModeSwitchProps>>()
    .toBeNever();
  expectTypeOf<Parameters<ColorModeSwitchProps['onValueChange']>>().toEqualTypeOf<
    ['light' | 'dark' | 'system']
  >();
});
