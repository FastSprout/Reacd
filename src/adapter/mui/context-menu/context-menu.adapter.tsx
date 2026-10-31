import type { ComponentProps, ComponentType } from 'react';
import { SharedContextMenu } from '../../shared/context-menu/context-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContextMenuProps = ComponentProps<typeof SharedContextMenu>;
export const MuiContextMenu: ComponentType<MuiContextMenuProps> = bindPrimitives(
  SharedContextMenu,
  muiPrimitives,
  'MuiContextMenu',
);
