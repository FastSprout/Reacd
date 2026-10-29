import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Pagination } from './pagination.js';
import type { PaginationProps } from './pagination.props.js';
it('exposes a named controlled paging value without native props', () => {
  expectTypeOf<Parameters<typeof Pagination>[0]>().toEqualTypeOf<PaginationProps>();
  expectTypeOf<ReturnType<typeof Pagination>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'className' | 'style' | 'onClick' | 'children', keyof PaginationProps>
  >().toBeNever();
  expectTypeOf<PaginationProps['value']>().toEqualTypeOf<
    Readonly<{
      pageIndex: number;
      pageSize: number;
    }>
  >();
});
