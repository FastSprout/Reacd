import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { FooterColumns } from './footer-columns.js';
import type { FooterColumnsProps } from './footer-columns.props.js';
it('exposes named logical props with no native styling or event escapes', () => {
  expectTypeOf<
    Parameters<typeof FooterColumns>[0]
  >().toEqualTypeOf<FooterColumnsProps>();
  expectTypeOf<ReturnType<typeof FooterColumns>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'onClick' | 'render' | 'id',
      keyof FooterColumnsProps
    >
  >().toBeNever();
});
