import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardSidebarCollapse } from
  '../../shared/dashboard-sidebar-collapse/dashboard-sidebar-collapse.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardSidebarCollapseProps = ComponentProps<
  typeof SharedDashboardSidebarCollapse
>;
export const MuiDashboardSidebarCollapse:
  ComponentType<MuiDashboardSidebarCollapseProps> =
  bindPrimitives(
    SharedDashboardSidebarCollapse,
    muiPrimitives,
    'MuiDashboardSidebarCollapse',
  );
