import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { PageLogos } from './page-logos.js';
import type { PageLogosProps } from './page-logos.props.js';

it('exports named closed PageLogos props', () => {
  expectTypeOf<Parameters<typeof PageLogos>[0]>().toEqualTypeOf<PageLogosProps>();
  expectTypeOf<ReturnType<typeof PageLogos>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'className' | 'style' | 'as' | 'marquee', keyof PageLogosProps>
  >().toBeNever();
});
