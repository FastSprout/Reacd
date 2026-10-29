import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { SelectMenu, type SelectMenuProps } from './index.js';

it('keeps mode-specific named Props and logical request signatures', () => {
  expectTypeOf<Parameters<typeof SelectMenu>[0]>().toEqualTypeOf<SelectMenuProps>();
  expectTypeOf<ReturnType<typeof SelectMenu>>().toEqualTypeOf<ReactNode>();
  type Single = Exclude<SelectMenuProps, { mode: 'multiple' }>;
  type Multiple = Extract<SelectMenuProps, { mode: 'multiple' }>;
  expectTypeOf<Parameters<Single['onValueChange']>>().toEqualTypeOf<[string]>();
  expectTypeOf<Parameters<Multiple['onValueChange']>>().toEqualTypeOf<
    [readonly string[]]
  >();
  expectTypeOf<
    Extract<
      'multiple' | 'max' | 'render' | 'style' | 'className' | 'onChange',
      keyof SelectMenuProps
    >
  >().toBeNever();
});
