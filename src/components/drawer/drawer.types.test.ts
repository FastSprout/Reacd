import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Drawer } from './drawer.js';
import type { DrawerProps } from './drawer.props.js';
it('exposes named logical panel props without native styling escapes', () => {
  expectTypeOf<Parameters<typeof Drawer>[0]>().toEqualTypeOf<DrawerProps>();
  expectTypeOf<ReturnType<typeof Drawer>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'className' | 'style' | 'snapPoints' | 'onKeyDown', keyof DrawerProps>
  >().toBeNever();
});
