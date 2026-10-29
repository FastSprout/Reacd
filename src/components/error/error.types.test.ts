import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Error } from './error.js';
import type { ErrorProps } from './error.props.js';

it('exposes a named closed Error contract', () => {
  expectTypeOf<Parameters<typeof Error>[0]>().toEqualTypeOf<ErrorProps>();
  expectTypeOf<ReturnType<typeof Error>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof ErrorProps>
  >().toBeNever();
});
