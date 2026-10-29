import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { CheckboxGroup } from './checkbox-group.js';
import type { CheckboxGroupProps } from './checkbox-group.props.js';

it('exposes named closed props and immutable selection values', () => {
  expectTypeOf<
    Parameters<typeof CheckboxGroup>[0]
  >().toEqualTypeOf<CheckboxGroupProps>();
  expectTypeOf<ReturnType<typeof CheckboxGroup>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<CheckboxGroupProps['value']>().toEqualTypeOf<readonly string[]>();
  expectTypeOf<Parameters<CheckboxGroupProps['onValueChange']>>().toEqualTypeOf<
    [readonly string[]]
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'onChange' | 'render', keyof CheckboxGroupProps>
  >().toBeNever();
});
