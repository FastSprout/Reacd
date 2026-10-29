import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Popover } from './popover.js';
import type { PopoverProps } from './popover.props.js';
it('requires controlled state and keeps platform rendering private', () => {
  expectTypeOf<Parameters<typeof Popover>[0]>().toEqualTypeOf<PopoverProps>();
  expectTypeOf<ReturnType<typeof Popover>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'render' | 'onClick', keyof PopoverProps>
  >().toBeNever();
  expectTypeOf<Omit<PopoverProps, 'onOpenChange'>>().not.toExtend<PopoverProps>();
});
