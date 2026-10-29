import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PinInput, type PinInputProps } from './pin-input.js';

it('exposes closed string props and an explicit ReactNode return', () => {
  expectTypeOf<Parameters<typeof PinInput>[0]>().toEqualTypeOf<PinInputProps>();
  expectTypeOf<ReturnType<typeof PinInput>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<PinInputProps['onValueChange']>>().toEqualTypeOf<[string]>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onChange' | 'render' | 'as', keyof PinInputProps>
  >().toBeNever();
});
