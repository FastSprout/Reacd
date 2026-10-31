import type { ComponentProps, ComponentType } from 'react';
import { SharedSelectMenu } from '../../shared/select-menu/select-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSelectMenuProps = ComponentProps<typeof SharedSelectMenu>;
export const MuiSelectMenu: ComponentType<MuiSelectMenuProps> = bindPrimitives(
  SharedSelectMenu,
  muiPrimitives,
  'MuiSelectMenu',
);
