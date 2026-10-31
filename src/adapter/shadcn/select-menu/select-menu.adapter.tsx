import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/select-menu/select-menu.adapter.js';
import { SharedSelectMenu } from '../../shared/select-menu/select-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSelectMenuProps = ComponentProps<typeof SharedSelectMenu>;
export const ShadcnSelectMenu: ComponentType<ShadcnSelectMenuProps> = bindPrimitives(
  SharedSelectMenu,
  shadcnPrimitives,
  'ShadcnSelectMenu',
);
