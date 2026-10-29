import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageCard } from './page-card.js';
import type { PageCardProps } from './page-card.props.js';

it('exposes a named closed PageCard contract', () => {
  expectTypeOf<Parameters<typeof PageCard>[0]>().toEqualTypeOf<PageCardProps>();
  expectTypeOf<ReturnType<typeof PageCard>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageCardProps>
  >().toBeNever();
});
