import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageBody } from './page-body.js';
import type { PageBodyProps } from './page-body.props.js';

it('exposes a named closed PageBody contract', () => {
  expectTypeOf<Parameters<typeof PageBody>[0]>().toEqualTypeOf<PageBodyProps>();
  expectTypeOf<ReturnType<typeof PageBody>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageBodyProps>
  >().toBeNever();
});
