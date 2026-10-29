import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Stepper } from './stepper.js';
import type { StepperProps } from './stepper.props.js';
it('exposes named logical props with no native styling or event escapes', () => {
  expectTypeOf<Parameters<typeof Stepper>[0]>().toEqualTypeOf<StepperProps>();
  expectTypeOf<ReturnType<typeof Stepper>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'onClick' | 'render' | 'id',
      keyof StepperProps
    >
  >().toBeNever();
});
