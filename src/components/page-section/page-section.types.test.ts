import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageSection } from './page-section.js';
import type { PageSectionProps } from './page-section.props.js';

it('exposes a named closed PageSection contract', () => {
  expectTypeOf<Parameters<typeof PageSection>[0]>().toEqualTypeOf<PageSectionProps>();
  expectTypeOf<ReturnType<typeof PageSection>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageSectionProps>
  >().toBeNever();
});
