import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { RadioGroup } from './radio-group.js';
import type { RadioGroupProps } from './radio-group.props.js';

it('exposes named closed props and string-only logical changes', () => {
  expectTypeOf<Parameters<typeof RadioGroup>[0]>().toEqualTypeOf<RadioGroupProps>();
  expectTypeOf<ReturnType<typeof RadioGroup>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<RadioGroupProps['onValueChange']>>().toEqualTypeOf<
    [string]
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'onChange' | 'render', keyof RadioGroupProps>
  >().toBeNever();
});
