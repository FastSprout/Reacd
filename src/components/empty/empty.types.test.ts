import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Empty } from './empty.js';
import type { EmptyProps } from './empty.props.js';
it('exposes named content and actions without native rendering props', () => {
  expectTypeOf<Parameters<typeof Empty>[0]>().toEqualTypeOf<EmptyProps>();
  expectTypeOf<ReturnType<typeof Empty>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<{}>().not.toExtend<Pick<EmptyProps, 'title'>>();
  expectTypeOf<
    Extract<'className' | 'style' | 'as' | 'icon' | 'onClick', keyof EmptyProps>
  >().toBeNever();
});
