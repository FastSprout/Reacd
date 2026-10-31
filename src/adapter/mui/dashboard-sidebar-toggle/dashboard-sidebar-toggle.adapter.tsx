import type { ComponentProps, ComponentType } from 'react';
import { SharedDashboardSidebarToggle } from
  '../../shared/dashboard-sidebar-toggle/dashboard-sidebar-toggle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiDashboardSidebarToggleProps = ComponentProps<
  typeof SharedDashboardSidebarToggle
>;
export const MuiDashboardSidebarToggle: ComponentType<MuiDashboardSidebarToggleProps> =
  bindPrimitives(
    SharedDashboardSidebarToggle,
    muiPrimitives,
    'MuiDashboardSidebarToggle',
  );
