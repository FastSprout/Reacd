import type { ComponentProps, ComponentType } from 'react';
import { SharedNavigationMenu } from
  '../../shared/navigation-menu/navigation-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiNavigationMenuProps = ComponentProps<typeof SharedNavigationMenu>;
export const MuiNavigationMenu: ComponentType<MuiNavigationMenuProps> = bindPrimitives(
  SharedNavigationMenu,
  muiPrimitives,
  'MuiNavigationMenu',
);
