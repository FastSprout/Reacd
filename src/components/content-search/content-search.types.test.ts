import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { ContentSearch } from './content-search.js';
import type { ContentSearchProps } from './content-search.props.js';

it('exposes a named closed content-search contract', () => {
  expectTypeOf<
    Parameters<typeof ContentSearch>[0]
  >().toEqualTypeOf<ContentSearchProps>();
  expectTypeOf<ReturnType<typeof ContentSearch>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'onClick', keyof ContentSearchProps>
  >().toBeNever();
});
