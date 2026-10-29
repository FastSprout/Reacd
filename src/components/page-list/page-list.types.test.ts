import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageList } from './page-list.js';
import type { PageListProps } from './page-list.props.js';

it('exposes a named closed PageList contract', () => {
  expectTypeOf<Parameters<typeof PageList>[0]>().toEqualTypeOf<PageListProps>();
  expectTypeOf<ReturnType<typeof PageList>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageListProps>
  >().toBeNever();
});
