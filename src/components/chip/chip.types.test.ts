import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Chip } from './chip.js';
import type { ChipProps } from './chip.props.js';

it('has a named closed indicator contract', () => {
  expectTypeOf<Parameters<typeof Chip>[0]>().toEqualTypeOf<ChipProps>();
  expectTypeOf<ReturnType<typeof Chip>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render', keyof ChipProps>
  >().toBeNever();
});
