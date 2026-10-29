import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Progress, type ProgressProps } from './progress.js';
it('exposes canonical numeric or indeterminate values and closed props', () => {
  expectTypeOf<Parameters<typeof Progress>[0]>().toEqualTypeOf<ProgressProps>();
  expectTypeOf<ReturnType<typeof Progress>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<ProgressProps['value']>().toEqualTypeOf<number | null | undefined>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'render', keyof ProgressProps>
  >().toBeNever();
});
