import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Avatar } from './avatar.js';
import type { AvatarProps } from './avatar.props.js';

it('exposes a named closed identity contract without native rendering hooks', () => {
  expectTypeOf<Parameters<typeof Avatar>[0]>().toEqualTypeOf<AvatarProps>();
  expectTypeOf<ReturnType<typeof Avatar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'onError' | 'render' | 'children',
      keyof AvatarProps
    >
  >().toBeNever();
});
