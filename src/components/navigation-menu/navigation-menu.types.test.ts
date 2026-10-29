import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { NavigationMenu } from './navigation-menu.js';
import type { NavigationMenuProps } from './navigation-menu.props.js';
it('exposes named logical props with no native styling or event escapes', () => {
  expectTypeOf<
    Parameters<typeof NavigationMenu>[0]
  >().toEqualTypeOf<NavigationMenuProps>();
  expectTypeOf<ReturnType<typeof NavigationMenu>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'as' | 'onClick' | 'render' | 'id',
      keyof NavigationMenuProps
    >
  >().toBeNever();
});
