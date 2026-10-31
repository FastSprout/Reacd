import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input-menu/input-menu.adapter.js';
import { SharedInputMenu } from '../../shared/input-menu/input-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputMenuProps = ComponentProps<typeof SharedInputMenu>;
export const ShadcnInputMenu: ComponentType<ShadcnInputMenuProps> = bindPrimitives(
  SharedInputMenu,
  shadcnPrimitives,
  'ShadcnInputMenu',
);
