import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Collapsible } from './collapsible.js';
import type { CollapsibleProps } from './collapsible.props.js';

it('exposes named closed props and a boolean-only change callback', () => {
  expectTypeOf<Parameters<typeof Collapsible>[0]>().toEqualTypeOf<CollapsibleProps>();
  expectTypeOf<ReturnType<typeof Collapsible>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Parameters<CollapsibleProps['onOpenChange']>>().toEqualTypeOf<
    [boolean]
  >();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'onClick' | 'asChild' | 'render',
      keyof CollapsibleProps
    >
  >().toBeNever();
});
