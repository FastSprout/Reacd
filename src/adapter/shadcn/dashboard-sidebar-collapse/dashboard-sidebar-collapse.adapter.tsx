import type { ComponentProps, ComponentType } from 'react';
export * from
  '../../shared/dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { SharedDashboardSidebarCollapse } from
  '../../shared/dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardSidebarCollapseProps = ComponentProps<
  typeof SharedDashboardSidebarCollapse
>;
export const ShadcnDashboardSidebarCollapse:
  ComponentType<ShadcnDashboardSidebarCollapseProps> =
  bindPrimitives(
    SharedDashboardSidebarCollapse,
    shadcnPrimitives,
    'ShadcnDashboardSidebarCollapse',
  );
