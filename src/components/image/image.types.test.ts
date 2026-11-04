import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { Image, type ImageProps } from './index.js';

it('exposes named closed Image properties', () => {
  expectTypeOf<Parameters<typeof Image>[0]>().toEqualTypeOf<ImageProps>();
  expectTypeOf<ReturnType<typeof Image>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<ImageProps['src']>().toEqualTypeOf<string>();
  expectTypeOf<ImageProps['alt']>().toEqualTypeOf<string>();
  expectTypeOf<ImageProps['aspect']>().toEqualTypeOf<
    'landscape' | 'square' | 'portrait' | undefined
  >();
  expectTypeOf<Extract<
    'style' | 'className' | 'as' | 'mode' | 'children' | 'width' | 'height' |
    'onLoad' | 'onError', keyof ImageProps
  >>().toBeNever();
});
