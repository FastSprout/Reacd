import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dropdown-menu/dropdown-menu.adapter.js';
import { SharedDropdownMenu } from
  '../../shared/dropdown-menu/dropdown-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDropdownMenuProps = ComponentProps<typeof SharedDropdownMenu>;
export const ShadcnDropdownMenu: ComponentType<ShadcnDropdownMenuProps> =
  bindPrimitives(SharedDropdownMenu, shadcnPrimitives, 'ShadcnDropdownMenu');
