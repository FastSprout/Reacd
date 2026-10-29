import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ColorModeAvatar, type ColorModeAvatarProps } from './index.js';

it('exposes named closed ColorModeAvatar properties', () => {
  expectTypeOf<Parameters<typeof ColorModeAvatar>[0]>().toEqualTypeOf<
    ColorModeAvatarProps
  >();
  expectTypeOf<ReturnType<typeof ColorModeAvatar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as', keyof ColorModeAvatarProps>>()
    .toBeNever();
});
