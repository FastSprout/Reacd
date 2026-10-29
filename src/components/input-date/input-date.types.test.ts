import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { InputDate, type InputDateProps } from './index.js';

it('exposes closed date values and a required explicit reference', () => {
  expectTypeOf<Parameters<typeof InputDate>[0]>().toEqualTypeOf<InputDateProps>();
  expectTypeOf<ReturnType<typeof InputDate>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<InputDateProps['referenceDate']>().toEqualTypeOf<string>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'as' | 'onChange', keyof InputDateProps>
  >().toBeNever();
  expectTypeOf<Extract<InputDateProps, { mode: 'range' }>['value']>().toEqualTypeOf<
    Readonly<{ start: string | null; end: string | null }>
  >();
});
