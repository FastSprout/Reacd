import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageCTA } from './page-cta.js';
import type { PageCTAProps } from './page-cta.props.js';

it('exposes a closed named PageCTA contract', () => {
  expectTypeOf<Parameters<typeof PageCTA>[0]>().toEqualTypeOf<PageCTAProps>();
  expectTypeOf<ReturnType<typeof PageCTA>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'as' | 'className' | 'style', keyof PageCTAProps>>().toBeNever();
});
