import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Kbd } from './kbd.js';
import type { KbdProps } from './kbd.props.js';
it('exposes named closed key presentation without event or native props', () => {
  expectTypeOf<Parameters<typeof Kbd>[0]>().toEqualTypeOf<KbdProps>();
  expectTypeOf<ReturnType<typeof Kbd>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'children' | 'style' | 'className' | 'onKeyDown', keyof KbdProps>
  >().toBeNever();
});
