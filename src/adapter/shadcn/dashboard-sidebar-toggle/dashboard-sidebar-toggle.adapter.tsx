import type { ComponentProps, ComponentType } from 'react';
export * from
  '../../shared/dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';
import { SharedDashboardSidebarToggle } from
  '../../shared/dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDashboardSidebarToggleProps = ComponentProps<
  typeof SharedDashboardSidebarToggle
>;
export const ShadcnDashboardSidebarToggle:
  ComponentType<ShadcnDashboardSidebarToggleProps> =
  bindPrimitives(
    SharedDashboardSidebarToggle,
    shadcnPrimitives,
    'ShadcnDashboardSidebarToggle',
  );
