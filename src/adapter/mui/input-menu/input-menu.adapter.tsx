import type { ComponentProps, ComponentType } from 'react';
import { SharedInputMenu } from '../../shared/input-menu/input-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputMenuProps = ComponentProps<typeof SharedInputMenu>;
export const MuiInputMenu: ComponentType<MuiInputMenuProps> = bindPrimitives(
  SharedInputMenu,
  muiPrimitives,
  'MuiInputMenu',
);
