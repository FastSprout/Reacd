import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { FieldGroup, type FieldGroupProps } from './index.js';

it('exposes named logical group props without native overrides', () => {
  expectTypeOf<Parameters<typeof FieldGroup>[0]>().toEqualTypeOf<FieldGroupProps>();
  expectTypeOf<ReturnType<typeof FieldGroup>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<FieldGroupProps['orientation']>().toEqualTypeOf<
    'horizontal' | 'vertical' | undefined
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'as' | 'onClick', keyof FieldGroupProps>
  >().toBeNever();
});
