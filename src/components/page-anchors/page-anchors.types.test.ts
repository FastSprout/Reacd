import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageAnchors } from './page-anchors.js';
import type { PageAnchorsProps } from './page-anchors.props.js';

it('exposes a closed named PageAnchors contract', () => {
  expectTypeOf<Parameters<typeof PageAnchors>[0]>().toEqualTypeOf<PageAnchorsProps>();
  expectTypeOf<ReturnType<typeof PageAnchors>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'className' | 'style', keyof PageAnchorsProps>
  >().toBeNever();
});
