import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { User } from './user.js';
import type { UserProps } from './user.props.js';
it('exposes named closed User properties', () => {
  expectTypeOf<Parameters<typeof User>[0]>().toEqualTypeOf<UserProps>();
  expectTypeOf<ReturnType<typeof User>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof UserProps>
  >().toBeNever();
});
