import type { ComponentType } from 'react';
import { SharedDivider } from '../../shared/divider/divider.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDividerProps = object;
export const MuiDivider: ComponentType<MuiDividerProps> = bindPrimitives(
  SharedDivider,
  muiPrimitives,
  'MuiDivider',
);
