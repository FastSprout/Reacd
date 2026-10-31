import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/context-menu/context-menu.adapter.js';
import { SharedContextMenu } from '../../shared/context-menu/context-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContextMenuProps = ComponentProps<typeof SharedContextMenu>;
export const ShadcnContextMenu: ComponentType<ShadcnContextMenuProps> = bindPrimitives(
  SharedContextMenu,
  shadcnPrimitives,
  'ShadcnContextMenu',
);
