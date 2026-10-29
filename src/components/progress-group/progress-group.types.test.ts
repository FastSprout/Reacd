import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ProgressGroup } from './progress-group.js';
import type { ProgressGroupProps } from './progress-group.props.js';
it('exposes named closed ProgressGroup properties', () => {
  expectTypeOf<
    Parameters<typeof ProgressGroup>[0]
  >().toEqualTypeOf<ProgressGroupProps>();
  expectTypeOf<ReturnType<typeof ProgressGroup>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render', keyof ProgressGroupProps>
  >().toBeNever();
});
