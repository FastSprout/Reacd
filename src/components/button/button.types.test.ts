import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Button, type ButtonProps } from './button.js';
it('preserves closed callbacks and explicit ReactNode declarations', () => {
  expectTypeOf<Parameters<typeof Button>[0]>().toEqualTypeOf<ButtonProps>();
  expectTypeOf<ReturnType<typeof Button>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<ButtonProps['onPress']>>().toEqualTypeOf<[]>();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'children', keyof ButtonProps>
  >().toBeNever();
});

it('exposes optional controlled boolean pressed state', () => {
  expectTypeOf<ButtonProps['pressed']>().toEqualTypeOf<boolean | undefined>();
  expectTypeOf<{ label: string; onPress: () => void; pressed: boolean }>()
    .toExtend<ButtonProps>();
  expectTypeOf<{ label: string; onPress: () => void; pressed: 'mixed' }>()
    .not.toExtend<ButtonProps>();
});
