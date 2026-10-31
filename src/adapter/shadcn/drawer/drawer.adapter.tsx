import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/drawer/drawer.adapter.js';
import { SharedDrawer } from '../../shared/drawer/drawer.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDrawerProps = ComponentProps<typeof SharedDrawer>;
export const ShadcnDrawer: ComponentType<ShadcnDrawerProps> = bindPrimitives(
  SharedDrawer,
  shadcnPrimitives,
  'ShadcnDrawer',
);
