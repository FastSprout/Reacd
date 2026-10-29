import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Tooltip } from './tooltip.js';
import type { TooltipProps } from './tooltip.props.js';

it('has a named closed contract and requires the controlled callback', () => {
  expectTypeOf<Parameters<typeof Tooltip>[0]>().toEqualTypeOf<TooltipProps>();
  expectTypeOf<ReturnType<typeof Tooltip>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<{ text: string; open: boolean }>().not.toExtend<TooltipProps>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render', keyof TooltipProps>
  >().toBeNever();
});
