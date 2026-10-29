import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Banner } from './banner.js';
import type { BannerProps } from './banner.props.js';
it('exposes named closed Banner properties', () => {
  expectTypeOf<Parameters<typeof Banner>[0]>().toEqualTypeOf<BannerProps>();
  expectTypeOf<ReturnType<typeof Banner>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof BannerProps>
  >().toBeNever();
});
