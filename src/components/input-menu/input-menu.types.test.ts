import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { InputMenu } from './input-menu.js';
import type { InputMenuProps } from './index.js';

it('exposes named closed text props and exact logical callback signatures', () => {
  expectTypeOf<Parameters<typeof InputMenu>[0]>().toEqualTypeOf<InputMenuProps>();
  expectTypeOf<ReturnType<typeof InputMenu>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<InputMenuProps['onValueChange']>>().toEqualTypeOf<[string]>();
  expectTypeOf<ReturnType<InputMenuProps['onValueChange']>>().toEqualTypeOf<
    boolean | void
  >();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'render' | 'multiple' | 'onChange' | 'selectedKey',
      keyof InputMenuProps
    >
  >().toBeNever();
});
