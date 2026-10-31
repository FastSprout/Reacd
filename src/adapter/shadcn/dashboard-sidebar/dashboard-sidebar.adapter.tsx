import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/dashboard-sidebar/dashboard-sidebar.adapter.js';
import { SharedDashboardSidebar } from
  '../../shared/dashboard-sidebar/dashboard-sidebar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardSidebarProps = ComponentProps<typeof SharedDashboardSidebar>;
export const ShadcnDashboardSidebar: ComponentType<ShadcnDashboardSidebarProps> =
  bindPrimitives(SharedDashboardSidebar, shadcnPrimitives, 'ShadcnDashboardSidebar');
