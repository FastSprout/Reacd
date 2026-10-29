import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageColumns } from './page-columns.js';
import type { PageColumnsProps } from './page-columns.props.js';

it('exposes a named closed PageColumns contract', () => {
  expectTypeOf<Parameters<typeof PageColumns>[0]>().toEqualTypeOf<PageColumnsProps>();
  expectTypeOf<ReturnType<typeof PageColumns>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageColumnsProps>
  >().toBeNever();
});
