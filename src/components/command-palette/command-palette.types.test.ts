import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { CommandPalette } from './command-palette.js';
import type { CommandPaletteProps } from './command-palette.props.js';
it('has named closed command props and synchronous selection callbacks', () => {
  expectTypeOf<
    Parameters<typeof CommandPalette>[0]
  >().toEqualTypeOf<CommandPaletteProps>();
  expectTypeOf<ReturnType<typeof CommandPalette>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<NonNullable<CommandPaletteProps['onSelect']>>().toEqualTypeOf<
    (key: string) => boolean | void
  >();
  expectTypeOf<(key: string) => Promise<void>>().not.toMatchTypeOf<
    NonNullable<CommandPaletteProps['onSelect']>
  >();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'render' | 'onKeyDown' | 'filter',
      keyof CommandPaletteProps
    >
  >().toBeNever();
});
