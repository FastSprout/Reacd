import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import type { ContextMenuProps } from './context-menu.props.js';
import { ContextMenu } from './context-menu.js';
it('exposes named context props without native trigger events', () => {
  expectTypeOf<Parameters<typeof ContextMenu>[0]>().toEqualTypeOf<ContextMenuProps>();
  expectTypeOf<ReturnType<typeof ContextMenu>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'onContextMenu' | 'onKeyDown',
      keyof ContextMenuProps
    >
  >().toBeNever();
});
