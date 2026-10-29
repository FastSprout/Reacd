import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageHero } from './page-hero.js';
import type { PageHeroProps } from './page-hero.props.js';

it('exposes a named closed PageHero contract', () => {
  expectTypeOf<Parameters<typeof PageHero>[0]>().toEqualTypeOf<PageHeroProps>();
  expectTypeOf<ReturnType<typeof PageHero>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageHeroProps>
  >().toBeNever();
});
