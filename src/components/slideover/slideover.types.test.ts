import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Slideover } from './slideover.js';
import type { SlideoverProps } from './slideover.props.js';
it('exposes named logical panel props without native styling escapes', () => {
  expectTypeOf<Parameters<typeof Slideover>[0]>().toEqualTypeOf<SlideoverProps>();
  expectTypeOf<ReturnType<typeof Slideover>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'className' | 'style' | 'snapPoints' | 'onKeyDown', keyof SlideoverProps>
  >().toBeNever();
});
