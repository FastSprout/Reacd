import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Container } from './container.js';
import type { ContainerProps } from './container.props.js';

it('exposes a named closed Container contract', () => {
  expectTypeOf<Parameters<typeof Container>[0]>().toEqualTypeOf<ContainerProps>();
  expectTypeOf<ReturnType<typeof Container>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof ContainerProps>
  >().toBeNever();
});
