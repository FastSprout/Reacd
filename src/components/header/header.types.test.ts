import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Header } from './header.js';
import type { HeaderProps } from './header.props.js';

it('exposes a named closed Header contract', () => {
  expectTypeOf<Parameters<typeof Header>[0]>().toEqualTypeOf<HeaderProps>();
  expectTypeOf<ReturnType<typeof Header>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof HeaderProps>
  >().toBeNever();
});
