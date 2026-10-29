import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Footer } from './footer.js';
import type { FooterProps } from './footer.props.js';

it('exposes a named closed Footer contract', () => {
  expectTypeOf<Parameters<typeof Footer>[0]>().toEqualTypeOf<FooterProps>();
  expectTypeOf<ReturnType<typeof Footer>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'as' | 'render' | 'onClick', keyof FooterProps>
  >().toBeNever();
});
