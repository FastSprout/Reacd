import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { InputTags, type InputTagsProps } from './input-tags.js';

it('exposes named, closed collection props with logical readonly changes', () => {
  expectTypeOf<Parameters<typeof InputTags>[0]>().toEqualTypeOf<InputTagsProps>();
  expectTypeOf<ReturnType<typeof InputTags>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<InputTagsProps['onValueChange']>>().toEqualTypeOf<
    [readonly string[]]
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'as' | 'onChange', keyof InputTagsProps>
  >().toBeNever();
});
