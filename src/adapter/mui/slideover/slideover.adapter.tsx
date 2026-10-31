import type { ComponentProps, ComponentType } from 'react';
import { SharedSlideover } from '../../shared/slideover/slideover.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSlideoverProps = ComponentProps<typeof SharedSlideover>;
export const MuiSlideover: ComponentType<MuiSlideoverProps> = bindPrimitives(
  SharedSlideover,
  muiPrimitives,
  'MuiSlideover',
);
