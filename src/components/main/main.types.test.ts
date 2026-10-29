import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Main } from './main.js';
import type { MainProps } from './main.props.js';

it('exposes a named closed Main contract', () => {
  expectTypeOf<Parameters<typeof Main>[0]>().toEqualTypeOf<MainProps>();
  expectTypeOf<ReturnType<typeof Main>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof MainProps>
  >().toBeNever();
});
