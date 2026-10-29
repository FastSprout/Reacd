import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageAside } from './page-aside.js';
import type { PageAsideProps } from './page-aside.props.js';

it('exposes a named closed PageAside contract', () => {
  expectTypeOf<Parameters<typeof PageAside>[0]>().toEqualTypeOf<PageAsideProps>();
  expectTypeOf<ReturnType<typeof PageAside>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageAsideProps>
  >().toBeNever();
});
