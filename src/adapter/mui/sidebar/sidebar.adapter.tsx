import type { ComponentProps, ComponentType } from 'react';
import { SharedSidebar } from '../../shared/sidebar/sidebar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSidebarProps = ComponentProps<typeof SharedSidebar>;
export const MuiSidebar: ComponentType<MuiSidebarProps> = bindPrimitives(
  SharedSidebar,
  muiPrimitives,
  'MuiSidebar',
);
