import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { App } from './app.js';
import type { AppProps } from './app.props.js';

it('exposes a named closed App contract', () => {
  expectTypeOf<Parameters<typeof App>[0]>().toEqualTypeOf<AppProps>();
  expectTypeOf<ReturnType<typeof App>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof AppProps>
  >().toBeNever();
});
