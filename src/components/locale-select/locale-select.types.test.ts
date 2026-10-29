import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { LocaleSelect, type LocaleSelectProps } from './index.js';

it('exposes named canonical selection props without a vendor surface', () => {
  expectTypeOf<Parameters<typeof LocaleSelect>[0]>().toEqualTypeOf<LocaleSelectProps>();
  expectTypeOf<ReturnType<typeof LocaleSelect>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<LocaleSelectProps['onValueChange']>>().toEqualTypeOf<
    [string]
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render', keyof LocaleSelectProps>
  >().toBeNever();
});
