import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Breadcrumb } from './breadcrumb.js';
import type { BreadcrumbProps } from './breadcrumb.props.js';
it('exposes named path items with logical actions and no styling escape', () => {
  expectTypeOf<Parameters<typeof Breadcrumb>[0]>().toEqualTypeOf<BreadcrumbProps>();
  expectTypeOf<ReturnType<typeof Breadcrumb>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'className' | 'style' | 'separatorIcon' | 'children', keyof BreadcrumbProps>
  >().toBeNever();
});
