import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { ContentSurround } from './content-surround.js';
import type { ContentSurroundProps } from './content-surround.props.js';

it('exposes a named closed adjacent-navigation contract', () => {
  expectTypeOf<
    Parameters<typeof ContentSurround>[0]
  >().toEqualTypeOf<ContentSurroundProps>();
  expectTypeOf<ReturnType<typeof ContentSurround>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'onClick', keyof ContentSurroundProps>
  >().toBeNever();
});
