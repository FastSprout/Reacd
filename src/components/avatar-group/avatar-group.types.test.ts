import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { AvatarGroup } from './avatar-group.js';
import type { AvatarGroupProps } from './avatar-group.props.js';

it('exposes named closed props and a readonly identity list', () => {
  expectTypeOf<Parameters<typeof AvatarGroup>[0]>().toEqualTypeOf<AvatarGroupProps>();
  expectTypeOf<ReturnType<typeof AvatarGroup>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<AvatarGroupProps['items']>().not.toMatchTypeOf<unknown[]>();
  expectTypeOf<
    Extract<'style' | 'className' | 'children' | 'as', keyof AvatarGroupProps>
  >().toBeNever();
});
