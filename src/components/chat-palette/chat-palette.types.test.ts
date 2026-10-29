import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatPalette } from './chat-palette.js';
import type { ChatPaletteProps } from './chat-palette.props.js';

it('exposes closed named ChatPalette properties', () => {
  expectTypeOf<Parameters<typeof ChatPalette>[0]>().toEqualTypeOf<ChatPaletteProps>();
  expectTypeOf<ReturnType<typeof ChatPalette>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onKeyDown', keyof ChatPaletteProps>
  >().toBeNever();
});
