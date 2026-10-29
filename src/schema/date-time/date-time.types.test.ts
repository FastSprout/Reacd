import { expectTypeOf, it } from 'vitest';
import type { z } from 'zod';
import {
  dateValueSchema,
  timeValueSchema,
  boundedDateValueSchema,
  boundedTimeValueSchema,
  dateRangeValueSchema,
  timeRangeValueSchema,
  type DateLimits,
  type TimeLimits,
} from './index.js';

it('keeps canonical state primitives and readonly closed range DTOs', () => {
  expectTypeOf<z.infer<typeof dateValueSchema>>().toEqualTypeOf<string | null>();
  expectTypeOf<z.infer<typeof timeValueSchema>>().toEqualTypeOf<string | null>();
  expectTypeOf<z.infer<ReturnType<typeof boundedDateValueSchema>>>().toEqualTypeOf<
    string | null
  >();
  expectTypeOf<z.infer<ReturnType<typeof boundedTimeValueSchema>>>().toEqualTypeOf<
    string | null
  >();
  expectTypeOf<z.infer<ReturnType<typeof dateRangeValueSchema>>>().toEqualTypeOf<
    Readonly<{ start: string | null; end: string | null }>
  >();
  expectTypeOf<z.infer<ReturnType<typeof timeRangeValueSchema>>>().toEqualTypeOf<
    Readonly<{ start: string | null; end: string | null }>
  >();
  expectTypeOf<keyof DateLimits>().toEqualTypeOf<'min' | 'max'>();
  expectTypeOf<keyof TimeLimits>().toEqualTypeOf<'min' | 'max'>();
});
