import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/sidebar/sidebar.adapter.js';
import { SharedSidebar } from '../../shared/sidebar/sidebar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSidebarProps = ComponentProps<typeof SharedSidebar>;
export const ShadcnSidebar: ComponentType<ShadcnSidebarProps> = bindPrimitives(
  SharedSidebar,
  shadcnPrimitives,
  'ShadcnSidebar',
);
