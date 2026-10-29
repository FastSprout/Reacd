import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { InputNumber, type InputNumberProps } from './input-number.js';

it('exposes closed nullable numeric props and an explicit ReactNode return', () => {
  expectTypeOf<Parameters<typeof InputNumber>[0]>().toEqualTypeOf<InputNumberProps>();
  expectTypeOf<ReturnType<typeof InputNumber>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<InputNumberProps['onValueChange']>>().toEqualTypeOf<
    [number | null]
  >();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'onChange' | 'render' | 'as',
      keyof InputNumberProps
    >
  >().toBeNever();
});
