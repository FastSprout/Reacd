import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Badge, type BadgeProps } from './badge.js';
it('exposes closed noninteractive badge props', () => {
  expectTypeOf<Parameters<typeof Badge>[0]>().toEqualTypeOf<BadgeProps>();
  expectTypeOf<ReturnType<typeof Badge>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'href', keyof BadgeProps>
  >().toBeNever();
});
