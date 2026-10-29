import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { Link } from './link.js';
import type { LinkProps } from './link.props.js';

it('exposes a named closed link contract', () => {
  expectTypeOf<Parameters<typeof Link>[0]>().toEqualTypeOf<LinkProps>();
  expectTypeOf<ReturnType<typeof Link>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick' | 'target', keyof LinkProps>
  >().toBeNever();
});
