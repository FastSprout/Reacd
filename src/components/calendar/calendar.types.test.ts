import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Calendar, type CalendarProps } from './index.js';

it('exposes closed canonical date/range props and a ReactNode declaration', () => {
  expectTypeOf<Parameters<typeof Calendar>[0]>().toEqualTypeOf<CalendarProps>();
  expectTypeOf<ReturnType<typeof Calendar>>().toEqualTypeOf<ReactNode>();
  type Single = Exclude<CalendarProps, { mode: 'range' }>;
  type Range = Extract<CalendarProps, { mode: 'range' }>;
  expectTypeOf<Single['value']>().toEqualTypeOf<string | null>();
  expectTypeOf<Parameters<Single['onValueChange']>>().toEqualTypeOf<[string | null]>();
  expectTypeOf<Range['value']>().toEqualTypeOf<{
    readonly start: string | null;
    readonly end: string | null;
  }>();
  expectTypeOf<Parameters<Range['onValueChange']>>().toEqualTypeOf<[Range['value']]>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'render' | 'as', keyof CalendarProps>
  >().toBeNever();
});
