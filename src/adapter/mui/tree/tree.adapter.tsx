import type { ComponentProps, ComponentType } from 'react';
import { SharedTree } from '../../shared/tree/tree.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTreeProps = ComponentProps<typeof SharedTree>;
export const MuiTree: ComponentType<MuiTreeProps> = bindPrimitives(
  SharedTree,
  muiPrimitives,
  'MuiTree',
);
