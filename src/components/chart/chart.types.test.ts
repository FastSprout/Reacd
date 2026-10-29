import { expectTypeOf, it } from 'vitest';
import type { ChartProps, ChartSeries } from './index.js';
it('exposes immutable typed chart content without rendering escapes', () => {
  expectTypeOf<ChartProps['kind']>().toEqualTypeOf<
    'line' | 'area' | 'bar' | 'donut' | undefined
  >();
  expectTypeOf<ChartSeries['values']>().toEqualTypeOf<readonly (number | null)[]>();
  expectTypeOf<
    Extract<'style' | 'className' | 'children' | 'render', keyof ChartProps>
  >().toEqualTypeOf<never>();
  expectTypeOf<ChartProps['onRetry']>().toEqualTypeOf<(() => void) | undefined>();
});
