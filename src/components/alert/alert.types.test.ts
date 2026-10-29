import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Alert, type AlertProps } from './alert.js';
it('keeps visibility and actions typed without native events', () => {
  expectTypeOf<Parameters<typeof Alert>[0]>().toEqualTypeOf<AlertProps>();
  expectTypeOf<ReturnType<typeof Alert>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'render', keyof AlertProps>
  >().toBeNever();
});
