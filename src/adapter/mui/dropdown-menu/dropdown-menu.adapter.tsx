import type { ComponentProps, ComponentType } from 'react';
import { SharedDropdownMenu } from
  '../../shared/dropdown-menu/dropdown-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDropdownMenuProps = ComponentProps<typeof SharedDropdownMenu>;
export const MuiDropdownMenu: ComponentType<MuiDropdownMenuProps> = bindPrimitives(
  SharedDropdownMenu,
  muiPrimitives,
  'MuiDropdownMenu',
);
