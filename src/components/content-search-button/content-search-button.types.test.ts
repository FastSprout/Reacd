import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { ContentSearchButton } from './content-search-button.js';
import type { ContentSearchButtonProps } from './content-search-button.props.js';

it('exposes a named closed search-trigger contract', () => {
  expectTypeOf<
    Parameters<typeof ContentSearchButton>[0]
  >().toEqualTypeOf<ContentSearchButtonProps>();
  expectTypeOf<ReturnType<typeof ContentSearchButton>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'onClick', keyof ContentSearchButtonProps>
  >().toBeNever();
});
