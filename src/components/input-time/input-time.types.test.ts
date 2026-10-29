import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { InputTime, type InputTimeProps } from './index.js';

it('exposes named discriminated time data without vendor or styling escapes', () => {
  expectTypeOf<Parameters<typeof InputTime>[0]>().toEqualTypeOf<InputTimeProps>();
  expectTypeOf<ReturnType<typeof InputTime>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'as' | 'onChange', keyof InputTimeProps>
  >().toBeNever();
  expectTypeOf<Extract<InputTimeProps, { mode: 'range' }>['value']>().toEqualTypeOf<
    Readonly<{ start: string | null; end: string | null }>
  >();
  expectTypeOf<Exclude<InputTimeProps, { mode: 'range' }>['value']>().toEqualTypeOf<
    string | null
  >();
});
