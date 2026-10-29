import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Theme } from './theme.js';
import type { ThemeProps } from './theme.props.js';

it('exposes a named closed Theme contract', () => {
  expectTypeOf<Parameters<typeof Theme>[0]>().toEqualTypeOf<ThemeProps>();
  expectTypeOf<ReturnType<typeof Theme>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof ThemeProps>
  >().toBeNever();
});
