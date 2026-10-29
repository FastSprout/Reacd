import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Separator } from './separator.js';
import type { SeparatorProps } from './separator.props.js';

it('exposes a named closed Separator contract', () => {
  expectTypeOf<Parameters<typeof Separator>[0]>().toEqualTypeOf<SeparatorProps>();
  expectTypeOf<ReturnType<typeof Separator>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof SeparatorProps>
  >().toBeNever();
});
