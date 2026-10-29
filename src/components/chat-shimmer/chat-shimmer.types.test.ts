import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChatShimmer } from './chat-shimmer.js';
import type { ChatShimmerProps } from './chat-shimmer.props.js';

it('exposes closed named ChatShimmer properties', () => {
  expectTypeOf<Parameters<typeof ChatShimmer>[0]>().toEqualTypeOf<ChatShimmerProps>();
  expectTypeOf<ReturnType<typeof ChatShimmer>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof ChatShimmerProps>
  >().toBeNever();
});
