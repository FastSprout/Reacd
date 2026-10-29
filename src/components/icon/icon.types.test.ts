import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Icon, type IconProps } from './index.js';
it('exposes closed named props with required meaningful alternatives', () => {
  expectTypeOf<Parameters<typeof Icon>[0]>().toEqualTypeOf<IconProps>();
  expectTypeOf<ReturnType<typeof Icon>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'children', keyof IconProps>
  >().toBeNever();
  expectTypeOf<
    Extract<IconProps, { decorative: true }>['label']
  >().toEqualTypeOf<undefined>();
});
