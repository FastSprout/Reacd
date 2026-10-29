import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Tree } from './tree.js';
import type { TreeProps } from './tree.props.js';
it('exposes named closed tree properties and readonly ids', () => {
  expectTypeOf<Parameters<typeof Tree>[0]>().toEqualTypeOf<TreeProps>();
  expectTypeOf<ReturnType<typeof Tree>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<TreeProps['value']>().toEqualTypeOf<readonly string[]>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof TreeProps>
  >().toBeNever();
});
