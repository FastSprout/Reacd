import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Sidebar } from './sidebar.js';
import type { SidebarProps } from './sidebar.props.js';

it('exposes named closed props and independent controlled pairs', () => {
  expectTypeOf<Parameters<typeof Sidebar>[0]>().toEqualTypeOf<SidebarProps>();
  expectTypeOf<ReturnType<typeof Sidebar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<SidebarProps['onOpenChange']>>().toEqualTypeOf<[boolean]>();
  expectTypeOf<Parameters<SidebarProps['onMobileOpenChange']>>().toEqualTypeOf<
    [boolean]
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof SidebarProps>
  >().toBeNever();
});
