import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Skeleton } from './skeleton.js';
import type { SkeletonProps } from './skeleton.props.js';
it('exposes a named closed placeholder contract', () => {
  expectTypeOf<Parameters<typeof Skeleton>[0]>().toEqualTypeOf<SkeletonProps>();
  expectTypeOf<ReturnType<typeof Skeleton>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'children' | 'className' | 'style' | 'width' | 'onClick',
      keyof SkeletonProps
    >
  >().toBeNever();
});
