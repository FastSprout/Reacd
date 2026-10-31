import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/navigation-menu/navigation-menu.adapter.js';
import { SharedNavigationMenu } from
  '../../shared/navigation-menu/navigation-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnNavigationMenuProps = ComponentProps<typeof SharedNavigationMenu>;
export const ShadcnNavigationMenu: ComponentType<ShadcnNavigationMenuProps> =
  bindPrimitives(SharedNavigationMenu, shadcnPrimitives, 'ShadcnNavigationMenu');
