import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { PageHeader } from './page-header.js';
import type { PageHeaderProps } from './page-header.props.js';

it('exposes a named closed PageHeader contract', () => {
  expectTypeOf<Parameters<typeof PageHeader>[0]>().toEqualTypeOf<PageHeaderProps>();
  expectTypeOf<ReturnType<typeof PageHeader>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof PageHeaderProps>
  >().toBeNever();
});
