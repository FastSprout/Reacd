import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { ContentNavigation } from './content-navigation.js';
import type { ContentNavigationProps } from './content-navigation.props.js';

it('exposes a named closed ContentNavigation contract', () => {
  expectTypeOf<Parameters<typeof ContentNavigation>[0]>()
    .toEqualTypeOf<ContentNavigationProps>();
  expectTypeOf<ReturnType<typeof ContentNavigation>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as' | 'onClick',
    keyof ContentNavigationProps>>().toBeNever();
});
