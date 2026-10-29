import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Splitter } from './splitter.js';
import type { SplitterProps } from './splitter.props.js';

it('exposes named closed percentage DTO props', () => {
  expectTypeOf<Parameters<typeof Splitter>[0]>().toEqualTypeOf<SplitterProps>();
  expectTypeOf<ReturnType<typeof Splitter>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<SplitterProps['onValueChange']>[0]>().toEqualTypeOf<
    readonly { id: string; share: number }[]
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof SplitterProps>
  >().toBeNever();
});
