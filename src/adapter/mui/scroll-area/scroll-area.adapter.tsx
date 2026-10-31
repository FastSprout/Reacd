import type { ComponentProps, ComponentType } from 'react';
import { SharedScrollArea } from '../../shared/scroll-area/scroll-area.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiScrollAreaProps = ComponentProps<typeof SharedScrollArea>;
export const MuiScrollArea: ComponentType<MuiScrollAreaProps> = bindPrimitives(
  SharedScrollArea,
  muiPrimitives,
  'MuiScrollArea',
);
