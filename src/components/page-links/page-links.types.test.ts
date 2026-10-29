import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageLinks } from './page-links.js';
import type { PageLinksProps } from './page-links.props.js';

it('exposes a closed named PageLinks contract', () => {
  expectTypeOf<Parameters<typeof PageLinks>[0]>().toEqualTypeOf<PageLinksProps>();
  expectTypeOf<ReturnType<typeof PageLinks>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'className' | 'style', keyof PageLinksProps>
  >().toBeNever();
});
