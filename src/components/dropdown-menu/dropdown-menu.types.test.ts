import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import type { DropdownMenuProps } from './dropdown-menu.props.js';
import { DropdownMenu } from './dropdown-menu.js';
it('exposes named closed props and synchronous item-specific callbacks', () => {
  expectTypeOf<Parameters<typeof DropdownMenu>[0]>().toEqualTypeOf<DropdownMenuProps>();
  expectTypeOf<ReturnType<typeof DropdownMenu>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onKeyDown', keyof DropdownMenuProps>
  >().toBeNever();
  type Action = Extract<DropdownMenuProps['items'][number], { type: 'action' }>;
  expectTypeOf<Action['onPress']>().toEqualTypeOf<() => boolean | void>();
  expectTypeOf<() => Promise<void>>().not.toMatchTypeOf<Action['onPress']>();
  type Link = Extract<DropdownMenuProps['items'][number], { type: 'link' }>;
  expectTypeOf<Extract<'onPress' | 'onClick', keyof Link>>().toBeNever();
});
