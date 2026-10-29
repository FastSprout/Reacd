import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageFeature } from './page-feature.js';
import type { PageFeatureProps } from './page-feature.props.js';

it('exposes a named closed PageFeature contract', () => {
  expectTypeOf<Parameters<typeof PageFeature>[0]>().toEqualTypeOf<PageFeatureProps>();
  expectTypeOf<ReturnType<typeof PageFeature>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageFeatureProps>
  >().toBeNever();
});
