import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Card, type CardProps } from './card.js';
it('exposes closed component slots and an explicit ReactNode result', () => {
  expectTypeOf<Parameters<typeof Card>[0]>().toEqualTypeOf<CardProps>();
  expectTypeOf<ReturnType<typeof Card>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<CardProps['header']>().toEqualTypeOf<ReactNode>();
  expectTypeOf<CardProps['footer']>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'render', keyof CardProps>
  >().toBeNever();
});
