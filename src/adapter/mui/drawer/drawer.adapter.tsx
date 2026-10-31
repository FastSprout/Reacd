import type { ComponentProps, ComponentType } from 'react';
import { SharedDrawer } from '../../shared/drawer/drawer.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDrawerProps = ComponentProps<typeof SharedDrawer>;
export const MuiDrawer: ComponentType<MuiDrawerProps> = bindPrimitives(
  SharedDrawer,
  muiPrimitives,
  'MuiDrawer',
);
