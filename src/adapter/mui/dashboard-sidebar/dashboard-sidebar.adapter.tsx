import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardSidebar } from
  '../../shared/dashboard-sidebar/dashboard-sidebar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardSidebarProps = ComponentProps<typeof SharedDashboardSidebar>;
export const MuiDashboardSidebar: ComponentType<MuiDashboardSidebarProps> =
  bindPrimitives(SharedDashboardSidebar, muiPrimitives, 'MuiDashboardSidebar');
