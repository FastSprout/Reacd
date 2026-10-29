import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageGrid } from './page-grid.js';
import type { PageGridProps } from './page-grid.props.js';

it('exposes a named closed PageGrid contract', () => {
  expectTypeOf<Parameters<typeof PageGrid>[0]>().toEqualTypeOf<PageGridProps>();
  expectTypeOf<ReturnType<typeof PageGrid>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageGridProps>
  >().toBeNever();
});
